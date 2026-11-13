import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { meetsFleetInsightsPlan } from "./utils/fleetPlanAccess";
import { resolvePlanTier } from "@/container/Dashboard/Accounts/utils/planTier";

test("procure plan is blocked from fleet insights", () => {
  assert.equal(meetsFleetInsightsPlan(resolvePlanTier("Procure")), false);
});

test("manage operate and scale plans unlock fleet insights", () => {
  assert.equal(meetsFleetInsightsPlan(resolvePlanTier("Manage")), true);
  assert.equal(meetsFleetInsightsPlan(resolvePlanTier("Operate")), true);
  assert.equal(meetsFleetInsightsPlan(resolvePlanTier("Scale Annual")), true);
});

test("access wrapper shows upsell for procure and page for manage+", () => {
  const wrapper = readFileSync(
    "src/container/Dashboard/FleetInsights/FleetInsightsAccessWrapper.tsx",
    "utf8",
  );
  const upsell = readFileSync(
    "src/container/Dashboard/FleetInsights/components/FleetInsightsUpsell.tsx",
    "utf8",
  );

  assert.match(wrapper, /useEntitlementOn\("telemetry_agent"\)/);
  assert.match(wrapper, /FleetInsightsUpsell/);
  assert.match(upsell, /Know your fleet at a glance/);
  assert.match(upsell, /useTransitionRouter/);
  assert.match(upsell, /isLoading=\{isPending\}/);
});

test("fleet insights route stays available but is hidden from the dashboard menu", () => {
  const routes = readFileSync("src/routes.ts", "utf8");
  const nav = readFileSync("src/app/dashboard/NavBar/NavItems.data.ts", "utf8");
  const permissions = readFileSync(
    "src/utils/auth/resolveDashboardPermissions.ts",
    "utf8",
  );

  assert.match(routes, /FLEET_INSIGHTS/);
  assert.match(nav, /id: "fleet-insights"/);
  assert.match(nav, /removeNav: true/);
  assert.match(permissions, /canViewFleetInsights/);
  assert.match(permissions, /case "fleet-insights"/);
});
