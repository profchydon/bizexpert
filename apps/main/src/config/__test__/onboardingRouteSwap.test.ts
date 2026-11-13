import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import routes from "@/routes";

const nextConfig = readFileSync("next.config.mjs", "utf8");

test("the wizard now owns every /onboarding route file", () => {
  ["page", "setup/page", "check-email/page", "complete/page"].forEach(
    (route) => {
      assert.equal(existsSync(`src/app/onboarding/${route}.tsx`), true);
    },
  );
  assert.equal(existsSync("src/app/new-onboarding"), false);
});

test("the wizard pages render the NewOnboarding containers", () => {
  const signup = readFileSync("src/app/onboarding/page.tsx", "utf8");
  const setup = readFileSync("src/app/onboarding/setup/page.tsx", "utf8");

  assert.match(signup, /@\/container\/NewOnboarding\/Signup/);
  assert.match(setup, /@\/container\/NewOnboarding\/Setup/);
});

test("the legacy flow is deprecated, not deleted", () => {
  assert.equal(existsSync("src/app/legacy-onboarding/page.tsx"), true);
  assert.match(
    readFileSync("src/app/legacy-onboarding/page.tsx", "utf8"),
    /@\/container\/Onboarding/,
  );
  assert.equal(routes.LEGACY_ONBOARDING, "/legacy-onboarding");
});

test("routes.ONBOARDING points at the wizard signup", () => {
  assert.equal(routes.ONBOARDING, "/onboarding");
});

test("old /new-onboarding links redirect instead of 404ing", () => {
  assert.match(nextConfig, /source: "\/new-onboarding\/:path\*"/);
  assert.match(nextConfig, /destination: "\/onboarding\/:path\*"/);
});
