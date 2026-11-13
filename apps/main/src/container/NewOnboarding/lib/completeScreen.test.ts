import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { resolveCompleteScreenAction } from "./completeScreen";

const base = {
  hasCompany: true,
  hasTxRef: false,
  isProgressLoading: false,
  onboardingCompleted: false,
};

test("an unfinished account is sent back to the wizard, not shown a success screen", () => {
  assert.equal(resolveCompleteScreenAction(base), "redirect-setup");
});

test("a finished account sees the success screen", () => {
  assert.equal(
    resolveCompleteScreenAction({ ...base, onboardingCompleted: true }),
    "show",
  );
});

test("a signed out visitor is sent to signup", () => {
  assert.equal(
    resolveCompleteScreenAction({ ...base, hasCompany: false }),
    "redirect-signup",
  );
});

test("a payment return is always shown, even before the webhook completes onboarding", () => {
  assert.equal(
    resolveCompleteScreenAction({
      ...base,
      hasTxRef: true,
      onboardingCompleted: false,
    }),
    "show",
  );
});

test("the screen waits for progress instead of bouncing on an unknown state", () => {
  assert.equal(
    resolveCompleteScreenAction({
      ...base,
      isProgressLoading: true,
      onboardingCompleted: undefined,
    }),
    "loading",
  );
});

test("a completed account leaving the wizard goes to the dashboard, not the success screen", () => {
  const setup = readFileSync(
    "src/container/NewOnboarding/Setup/index.tsx",
    "utf8",
  );

  assert.match(setup, /onboarding_completed/);
  assert.match(setup, /replace\(routes\.DASHBOARD\)/);
  assert.equal(setup.includes("replace(completePath)"), false);
});
