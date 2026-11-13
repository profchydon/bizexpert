import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ORDER_FLOWS_NEW_ONLY_ROUTES,
  resolveLegacyRouteForNewFlow,
} from "../orderFlowsLegacyRoutes";
import routes from "@/routes";

describe("resolveLegacyRouteForNewFlow", () => {
  it("redirects onboard routes to marketplace", () => {
    assert.equal(
      resolveLegacyRouteForNewFlow(routes.EMPLOYEES_ONBOARD_DEVICES),
      routes.EQUIP_EMPLOYEE_MARKETPLACE,
    );
    assert.equal(
      resolveLegacyRouteForNewFlow(`${routes.EMPLOYEES_ONBOARD_SUMMARY}?x=1`),
      routes.EQUIP_EMPLOYEE_MARKETPLACE,
    );
  });

  it("redirects offboard routes to asset offboarding", () => {
    assert.equal(
      resolveLegacyRouteForNewFlow(routes.EMPLOYEES_OFFBOARD_DEVICES),
      routes.OFFBOARDING,
    );
    assert.equal(
      resolveLegacyRouteForNewFlow(routes.EMPLOYEES_OFFBOARD_SUMMARY),
      routes.OFFBOARDING,
    );
  });

  it("falls back to dashboard for unknown paths", () => {
    assert.equal(
      resolveLegacyRouteForNewFlow("/dashboard/unknown"),
      routes.DASHBOARD,
    );
  });
});

describe("ORDER_FLOWS_NEW_ONLY_ROUTES", () => {
  it("lists every employee-centric new flow route", () => {
    assert.deepEqual(ORDER_FLOWS_NEW_ONLY_ROUTES, [
      routes.EMPLOYEES_ONBOARD_DEVICES,
      routes.EMPLOYEES_ONBOARD_SUMMARY,
      routes.EMPLOYEES_OFFBOARD_DEVICES,
      routes.EMPLOYEES_OFFBOARD_SUMMARY,
    ]);
  });
});
