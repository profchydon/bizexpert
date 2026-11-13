import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import type { IPlan } from "@/types/plans";
import { SELECTABLE_PLAN_SLUGS, selectablePlans } from "./planPresentation";

const setup = readFileSync(
  "src/container/NewOnboarding/Setup/index.tsx",
  "utf8",
);
const continueSetup = readFileSync(
  "src/container/NewOnboarding/Setup/continueOnboardingSetup.ts",
  "utf8",
);
const wizard = readFileSync(
  "src/container/NewOnboarding/lib/useOnboardingWizard.ts",
  "utf8",
);
const endpoint = readFileSync(
  "src/api/baseQueries/companiesApi/onboardingApi/selectPlan.ts",
  "utf8",
);

function planWithSlug(slug: string) {
  return { slug, name: slug, features: [], offers: [] } as unknown as IPlan;
}

test("the selectable slugs are exactly the documented request enum", () => {
  assert.deepEqual(SELECTABLE_PLAN_SLUGS, [
    "procure",
    "manage",
    "operate",
    "scale",
  ]);
});

test("a plan the documented enum does not accept is never offered", () => {
  const filtered = selectablePlans([
    planWithSlug("procure"),
    planWithSlug("enterprise"),
    planWithSlug("scale"),
  ]);

  assert.deepEqual(
    filtered.map((plan) => plan.slug),
    ["procure", "scale"],
  );
});

test("filtering preserves the api response order", () => {
  const filtered = selectablePlans([
    planWithSlug("scale"),
    planWithSlug("procure"),
  ]);

  assert.deepEqual(
    filtered.map((plan) => plan.slug),
    ["scale", "procure"],
  );
});

test("the wizard offers only selectable plans", () => {
  assert.match(wizard, /selectablePlans\(catalogPlans\(/);
});

test("the request body is the documented plan_slug only", () => {
  assert.match(endpoint, /plan_slug: PlanSlug/);
  assert.match(endpoint, /url: `\/\$\{companyId\}\/onboarding\/plan`/);
  assert.match(endpoint, /method: "POST"/);
});

test("requires_payment routes to checkout and free plans complete inline", () => {
  const paymentBranch = continueSetup.indexOf(
    "response.data?.requires_payment",
  );
  const completeBranch = continueSetup.indexOf("deps.push(deps.completePath)");

  assert.ok(paymentBranch > 0);
  assert.ok(paymentBranch < completeBranch);
  assert.match(continueSetup, /deps\.startPayment\(\)/);
  assert.match(setup, /continueOnboardingSetup\(/);
});

test("a failed plan save surfaces the api message instead of failing silently", () => {
  assert.match(continueSetup, /showApiError\(error\)/);
  assert.doesNotMatch(
    continueSetup,
    /displayErrorMessage\(title, description\)/,
  );
  assert.equal(continueSetup.includes("} catch {}"), false);
});
