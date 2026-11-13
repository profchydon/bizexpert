import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  isOnboardingIncomplete,
  NEW_ONBOARDING_SETUP_ROUTE,
  resolveOnboardingRoute,
} from "../onboardingRoutes";

const INCOMPLETE_STAGES = [
  "Verification",
  "Company Details",
  "Company Information",
  "Onboarding",
];

test("every incomplete stage routes into the new wizard when the flag is on", () => {
  INCOMPLETE_STAGES.forEach((stage) => {
    assert.equal(
      resolveOnboardingRoute(stage, true),
      NEW_ONBOARDING_SETUP_ROUTE,
    );
  });
});

test("flag off preserves the legacy per-stage routes at the deprecated path", () => {
  assert.equal(
    resolveOnboardingRoute("Verification", false),
    "/legacy-onboarding?stage=verify",
  );
  assert.equal(
    resolveOnboardingRoute("Company Details", false),
    "/legacy-onboarding?stage=company-profile",
  );
  assert.equal(
    resolveOnboardingRoute("Company Information", false),
    "/legacy-onboarding?stage=company-information",
  );
});

test("the wizard now owns the canonical onboarding path", () => {
  assert.equal(NEW_ONBOARDING_SETUP_ROUTE, "/onboarding/setup");
});

test("the new Onboarding stage always reaches the wizard, even with the flag off", () => {
  assert.equal(
    resolveOnboardingRoute("Onboarding", false),
    NEW_ONBOARDING_SETUP_ROUTE,
  );
  assert.equal(
    resolveOnboardingRoute("Onboarding", true),
    NEW_ONBOARDING_SETUP_ROUTE,
  );
});

test("a completed account is never redirected, with the flag on or off", () => {
  assert.equal(resolveOnboardingRoute("Completed", true), null);
  assert.equal(resolveOnboardingRoute("Completed", false), null);
});

test("unknown, missing and empty stages are never redirected", () => {
  [undefined, null, "", "Something Else"].forEach((stage) => {
    assert.equal(resolveOnboardingRoute(stage, true), null);
    assert.equal(resolveOnboardingRoute(stage, false), null);
  });
});

test("incomplete stage detection matches the legacy stage list", () => {
  INCOMPLETE_STAGES.forEach((stage) => {
    assert.equal(isOnboardingIncomplete(stage), true);
  });
  assert.equal(isOnboardingIncomplete("Completed"), false);
  assert.equal(isOnboardingIncomplete(undefined), false);
});

test("the legacy stage params still match the Stages enum they replaced", () => {
  const source = readFileSync("src/container/Onboarding/index.tsx", "utf8");

  assert.match(source, /Verify = "verify"/);
  assert.match(source, /CompanyProfile = "company-profile"/);
  assert.match(source, /CompanyInformation = "company-information"/);
});
