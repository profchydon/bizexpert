import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  buildOnboardingCheckout,
  buildPlanSelectionPayload,
  ONBOARDING_CHECKOUT_PATH,
} from "./checkoutPayload";

test("paid onboarding checkout uses the catalog plan id and a relative return path", () => {
  assert.deepEqual(buildOnboardingCheckout("company-1", "plan-1"), {
    companyId: "company-1",
    planId: "plan-1",
    redirectUrl: ONBOARDING_CHECKOUT_PATH,
  });
  assert.equal(ONBOARDING_CHECKOUT_PATH.startsWith("/"), true);
  assert.equal(ONBOARDING_CHECKOUT_PATH.includes("://"), false);
});

test("checkout is not built without a company or a plan id", () => {
  assert.equal(buildOnboardingCheckout("", "plan-1"), null);
  assert.equal(buildOnboardingCheckout("company-1", ""), null);
});

test("plan selection carries the company and the chosen slug", () => {
  assert.deepEqual(buildPlanSelectionPayload("company-1", "manage"), {
    companyId: "company-1",
    plan_slug: "manage",
  });
});
