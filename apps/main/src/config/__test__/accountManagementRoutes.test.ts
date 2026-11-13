import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ACCOUNT_MANAGEMENT_ROUTE_PREFIX,
  isAccountManagementPath,
  resolveRouteWhenAccountManagementDisabled,
} from "../accountManagementRoutes";
import routes from "@/routes";

describe("ACCOUNT_MANAGEMENT_ROUTE_PREFIX", () => {
  it("matches the accounts dashboard route", () => {
    assert.equal(ACCOUNT_MANAGEMENT_ROUTE_PREFIX, routes.ACCOUNTS);
  });
});

describe("isAccountManagementPath", () => {
  it("matches the list route and nested detail routes", () => {
    assert.equal(isAccountManagementPath(routes.ACCOUNTS), true);
    assert.equal(
      isAccountManagementPath(routes.SUBSIDIARY_DETAIL("sub-hq")),
      true,
    );
    assert.equal(
      isAccountManagementPath(routes.OFFICE_DETAIL("office-1")),
      true,
    );
  });

  it("does not match unrelated dashboard routes", () => {
    assert.equal(isAccountManagementPath(routes.OVERVIEW), false);
    assert.equal(isAccountManagementPath(routes.SETTINGS), false);
  });
});

describe("resolveRouteWhenAccountManagementDisabled", () => {
  it("redirects to the dashboard overview", () => {
    assert.equal(resolveRouteWhenAccountManagementDisabled(), routes.OVERVIEW);
  });
});
