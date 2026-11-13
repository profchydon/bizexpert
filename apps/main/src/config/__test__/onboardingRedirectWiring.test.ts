import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { FEATURE_FLAGS } from "../featureFlags";

const authProtect = readFileSync(
  "src/components/HOC/AuthProtectWrapper.tsx",
  "utf8",
);
const callback = readFileSync("src/container/Auth/Callback.tsx", "utf8");
const employeeAuthProtect = readFileSync(
  "src/components/HOC/EmployeeAuthProtectWrapper.tsx",
  "utf8",
);
const flagHook = readFileSync("src/hooks/useNewOnboardingFlag.ts", "utf8");
const verifyForm = readFileSync(
  "src/container/NewOnboarding/CheckEmail/VerifyForm.tsx",
  "utf8",
);

test("the new onboarding flag is env suffixed like every other flag", () => {
  assert.match(FEATURE_FLAGS.NEW_ONBOARDING, /^remote_newOnboarding_/);
});

test("all three shared redirect points resolve the route through the flag", () => {
  [authProtect, callback, employeeAuthProtect].forEach((source) => {
    assert.match(source, /resolveOnboardingRoute/);
    assert.match(source, /useNewOnboardingFlag/);
  });
});

test("no redirect point hardcodes an onboarding stage route any more", () => {
  [authProtect, employeeAuthProtect].forEach((source) => {
    assert.equal(source.includes("Stages.CompanyProfile"), false);
    assert.equal(source.includes("Stages.CompanyInformation"), false);
    assert.equal(source.includes("Stages.Verify"), false);
  });
});

test("the signed out redirect now lands on the new signup at /onboarding", () => {
  [authProtect, employeeAuthProtect].forEach((source) => {
    assert.match(source, /router\.push\(routes\.ONBOARDING\);/);
    assert.equal(source.includes("Stages.Signup"), false);
  });
});

test("the new onboarding flag defaults to enabled so it works without posthog config", () => {
  assert.match(flagHook, /defaultEnabled:\s*true/);
  assert.match(flagHook, /FEATURE_FLAGS\.NEW_ONBOARDING/);
});

test("redirects wait for the flag to resolve so users cannot flash the wrong flow", () => {
  assert.match(authProtect, /if \(!isNewOnboardingResolved\) return;/);
  assert.match(callback, /!isNewOnboardingResolved/);
  assert.match(employeeAuthProtect, /!isNewOnboardingResolved/);
});

test("member-only users are routed to the employee area before any onboarding check", () => {
  const memberOnlyIndex = authProtect.indexOf(
    "shouldRedirectBasicUserToEmployeePortal(access)",
  );
  const resolveIndex = authProtect.indexOf("resolveOnboardingRoute(");

  assert.ok(memberOnlyIndex > 0);
  assert.ok(memberOnlyIndex < resolveIndex);
});

test("otp verification no longer stashes a cross origin post login redirect", () => {
  assert.equal(verifyForm.includes("post_login_redirect"), false);
  assert.equal(verifyForm.includes("sessionStorage"), false);
});

test("the callback still consumes an existing post login redirect for completed users", () => {
  assert.match(callback, /consumeIntendedPath/);
  assert.match(callback, /removeItem\(redirectStorageKey\)/);
});
