import { strict as assert } from "node:assert";
import { test } from "node:test";
import { continueOnboardingSetup } from "./continueOnboardingSetup";

function deps(overrides: Record<string, unknown> = {}) {
  return {
    canContinue: true,
    setShowErrors: () => undefined,
    step: 4,
    saveCurrentStep: async () => undefined,
    setStep: () => undefined,
    submitPlan: async () => ({ data: { requires_payment: true } }),
    requiresPayment: false,
    startPayment: async () => "failed" as const,
    refreshAuthSession: async () => true,
    push: () => undefined,
    completePath: "/onboarding/complete",
    ...overrides,
  };
}

test("a missing payment link stays on the plan step", async () => {
  const calls: string[] = [];
  await continueOnboardingSetup(
    deps({
      startPayment: async () => {
        calls.push("pay");
        return "failed";
      },
      refreshAuthSession: async () => {
        calls.push("refresh");
        return true;
      },
      push: (path: string) => {
        calls.push(path);
      },
    }),
  );
  assert.deepEqual(calls, ["pay"]);
});

test("a priced plan still checks out when the save does not ask for payment", async () => {
  const calls: string[] = [];
  await continueOnboardingSetup(
    deps({
      requiresPayment: true,
      submitPlan: async () => ({ data: { requires_payment: false } }),
      startPayment: async () => {
        calls.push("pay");
        return "failed";
      },
      push: (path: string) => {
        calls.push(path);
      },
    }),
  );
  assert.deepEqual(calls, ["pay"]);
});

test("redirected checkout does not push the complete path", async () => {
  const calls: string[] = [];
  await continueOnboardingSetup(
    deps({
      startPayment: async () => {
        calls.push("pay");
        return "redirected";
      },
      push: (path: string) => {
        calls.push(path);
      },
    }),
  );
  assert.deepEqual(calls, ["pay"]);
});

test("a free plan finishes without checkout", async () => {
  const calls: string[] = [];
  await continueOnboardingSetup(
    deps({
      submitPlan: async () => ({ data: { requires_payment: false } }),
      startPayment: async () => {
        calls.push("pay");
        return "failed";
      },
      refreshAuthSession: async () => {
        calls.push("refresh");
        return true;
      },
      push: (path: string) => {
        calls.push(path);
      },
    }),
  );
  assert.deepEqual(calls, ["refresh", "/onboarding/complete"]);
});
