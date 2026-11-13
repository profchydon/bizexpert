import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const wizard = readFileSync(
  "src/container/NewOnboarding/lib/useOnboardingWizard.ts",
  "utf8",
);

const setup = readFileSync(
  "src/container/NewOnboarding/Setup/index.tsx",
  "utf8",
);

const continueSetup = readFileSync(
  "src/container/NewOnboarding/Setup/continueOnboardingSetup.ts",
  "utf8",
);

const complete = readFileSync(
  "src/container/NewOnboarding/Complete/index.tsx",
  "utf8",
);

test("make payment does not log the payload and still submits it", () => {
  assert.equal(setup.includes("console.log"), false);
  assert.equal(continueSetup.includes("console.log"), false);
  assert.match(setup, /continueOnboardingSetup\(/);

  const submitIndex = continueSetup.indexOf("await deps.submitPlan()");
  const payIndex = continueSetup.indexOf("await deps.startPayment()");

  assert.ok(submitIndex > 0);
  assert.ok(submitIndex < payIndex);
});

test("paid checkout posts the catalog plan id to change-plan", () => {
  assert.match(wizard, /buildOnboardingCheckout\(/);
  assert.match(wizard, /await changePlan\(checkout\)\.unwrap\(\)/);
  assert.match(wizard, /response\.data\?\.collection\?\.link/);
  assert.equal(wizard.includes("plan_pricing_id"), false);
  assert.equal(wizard.includes("paySubscription"), false);
  assert.equal(wizard.includes("resolveCountryId"), false);
});

test("a missing plan id still blocks the request", () => {
  const guardIndex = wizard.indexOf('if (!checkout) return "failed" as const;');
  const requestIndex = wizard.indexOf("await changePlan(checkout)");

  assert.ok(guardIndex > 0);
  assert.ok(guardIndex < requestIndex);
});

test("a change-plan without a link does not finish onboarding", () => {
  assert.match(wizard, /resolveCheckoutHandoff\(/);
  assert.equal(continueSetup.includes('handoff === "applied"'), false);
  assert.match(continueSetup, /requiresPayment/);
  assert.match(
    continueSetup,
    /The plan was saved, but no payment link came back/,
  );
});

test("a successful change-plan hands off to the checkout link", () => {
  assert.match(wizard, /globalThis\.location\.assign\(link\)/);
  assert.match(wizard, /setIsRedirectingToPayment\(true\)/);
});

test("the return page verifies the subscription transaction", () => {
  assert.match(complete, /useVerifySubscriptionPlanChangeQuery/);
  assert.equal(complete.includes("useVerifyOrderPaymentQuery"), false);
});
