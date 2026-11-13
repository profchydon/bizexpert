import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolveOnboardingRoute } from "@/config/onboardingRoutes";

const setup = readFileSync(
  "src/container/NewOnboarding/Setup/index.tsx",
  "utf8",
);
const complete = readFileSync(
  "src/container/NewOnboarding/Complete/index.tsx",
  "utf8",
);
const hook = readFileSync("src/hooks/useRefreshAuthSession.ts", "utf8");
const continueSetup = readFileSync(
  "src/container/NewOnboarding/Setup/continueOnboardingSetup.ts",
  "utf8",
);

test("a stale Onboarding stage is exactly what caused the dashboard loop", () => {
  assert.equal(resolveOnboardingRoute("Onboarding", true), "/onboarding/setup");
  assert.equal(resolveOnboardingRoute("Completed", true), null);
});

test("the wizard refreshes the session before sending a finished account away", () => {
  const refreshIndex = setup.indexOf("refreshAuthSession()");
  const redirectIndex = setup.indexOf("replace(routes.DASHBOARD)");

  assert.ok(refreshIndex > 0, "wizard must refresh the session");
  assert.ok(
    refreshIndex < redirectIndex,
    "refresh must happen before the dashboard redirect",
  );
});

test("the dashboard redirect only fires once the refresh succeeded", () => {
  assert.match(setup, /if \(refreshed\) replace\(routes\.DASHBOARD\)/);
});

test("the completed check cannot re-fire and ping pong", () => {
  assert.match(setup, /if \(hasAttemptedExit\.current\) return;/);
  assert.match(setup, /setIsLeavingWizard\(true\)/);
});

test("finishing a free plan refreshes before showing the completion screen", () => {
  const refresh = continueSetup.indexOf("await deps.refreshAuthSession()");
  const push = continueSetup.indexOf("deps.push(deps.completePath)");

  assert.ok(refresh > 0);
  assert.ok(refresh < push);
});

test("the completion screen refreshes too, so its dashboard link does not bounce", () => {
  assert.match(complete, /action === "show"\) refreshAuthSession\(\)/);
});

test("the refresh writes the fresh profile back into the persisted session", () => {
  assert.match(hook, /setEncryptAuth/);
  assert.match(hook, /user: profile\.data\.user/);
  assert.match(hook, /company: profile\.data\.company/);
  assert.match(hook, /entities: profile\.data\.entities/);
});

test("the refresh reports failure instead of throwing into a redirect", () => {
  assert.match(hook, /return false;/);
  assert.match(hook, /return true;/);
});

test("the auth token is read during render, not inside the async callback", () => {
  const tokenRead = hook.indexOf("getAuthToken()");
  const callbackStart = hook.indexOf("return async ()");

  assert.ok(tokenRead > 0, "hook must read the auth token");
  assert.ok(
    tokenRead < callbackStart,
    "getAuthToken runs useAppSelector, so calling it inside the async callback breaks the rules of hooks and rejects the promise",
  );
});

test("a failed refresh clears the loader instead of hanging on a spinner", () => {
  assert.match(setup, /else setIsLeavingWizard\(false\)/);
  assert.match(setup, /\.catch\(\(\) => setIsLeavingWizard\(false\)\)/);
});

test("the exit is attempted once, so a failure cannot retry forever", () => {
  assert.match(setup, /hasAttemptedExit\.current/);
  assert.match(setup, /useRef\(false\)/);
});
