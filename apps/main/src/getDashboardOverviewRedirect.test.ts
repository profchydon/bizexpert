import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { getDashboardOverviewRedirectPath } from "@/getDashboardOverviewRedirect";
import routes from "@/routes";

describe("getDashboardOverviewRedirectPath", () => {
  it("sends /dashboard to /dashboard/overview", () => {
    assert.equal(
      getDashboardOverviewRedirectPath(routes.DASHBOARD),
      routes.OVERVIEW,
    );
    assert.equal(
      getDashboardOverviewRedirectPath(`${routes.DASHBOARD}/`),
      routes.OVERVIEW,
    );
  });

  it("does not redirect nested dashboard routes", () => {
    assert.equal(getDashboardOverviewRedirectPath(routes.OVERVIEW), null);
    assert.equal(getDashboardOverviewRedirectPath(routes.ORDERS), null);
    assert.equal(getDashboardOverviewRedirectPath(routes.EMPLOYEES), null);
  });
});

describe("middleware dashboard overview wiring", () => {
  it("matches /dashboard and uses the overview redirect helper", () => {
    const source = readFileSync("src/middleware.ts", "utf8");

    assert.match(source, /getDashboardOverviewRedirectPath/);
    assert.match(source, /"\/dashboard"/);
    assert.match(source, /307/);
  });
});
