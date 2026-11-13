import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("access context route wiring", () => {
  it("routes dashboard guards through resolveAccessContext", () => {
    const authProtect = readFileSync(
      "src/components/HOC/AuthProtectWrapper.tsx",
      "utf8",
    );
    const authRedirect = readFileSync(
      "src/components/HOC/AuthRedirectWrapper.tsx",
      "utf8",
    );
    const callback = readFileSync("src/container/Auth/Callback.tsx", "utf8");
    const dashboardPage = readFileSync("src/app/dashboard/page.tsx", "utf8");

    assert.match(authProtect, /resolveAccessContext/);
    assert.match(authProtect, /shouldRedirectBasicUserToEmployeePortal/);
    assert.match(authRedirect, /resolveDefaultDashboardRoute/);
    assert.match(callback, /resolveDefaultDashboardRoute/);
    assert.match(dashboardPage, /redirect\(routes\.OVERVIEW\)/);
    assert.doesNotMatch(dashboardPage, /"use client"/);
    assert.doesNotMatch(dashboardPage, /router\.push\(routes\.DASHBOARD\)/);
  });

  it("checks member-only access before onboarding redirects in AuthProtectWrapper", () => {
    const authProtect = readFileSync(
      "src/components/HOC/AuthProtectWrapper.tsx",
      "utf8",
    );
    const memberOnlyIndex = authProtect.indexOf(
      "shouldRedirectBasicUserToEmployeePortal(access)",
    );
    const resolveIndex = authProtect.indexOf("resolveOnboardingRoute(");

    assert.ok(memberOnlyIndex > 0);
    assert.ok(memberOnlyIndex < resolveIndex);
  });
});
