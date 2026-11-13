import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import routes from "@/routes";

const dashboardPage = readFileSync("src/app/dashboard/page.tsx", "utf8");
const nextConfig = readFileSync("next.config.mjs", "utf8");
const middleware = readFileSync("src/middleware.ts", "utf8");

describe("dashboard index redirect", () => {
  it("sends /dashboard to overview on the server without waiting for client auth", () => {
    assert.equal(routes.OVERVIEW, "/dashboard/overview");
    assert.match(dashboardPage, /redirect\(routes\.OVERVIEW\)/);
    assert.doesNotMatch(dashboardPage, /"use client"/);
    assert.doesNotMatch(dashboardPage, /useEffect/);
    assert.doesNotMatch(dashboardPage, /resolveDefaultDashboardRoute/);
  });

  it("redirects /dashboard and /dashboard/ before the blank index page can render", () => {
    assert.match(nextConfig, /source: "\/dashboard"/);
    assert.match(nextConfig, /source: "\/dashboard\/"/);
    assert.match(nextConfig, /destination: "\/dashboard\/overview"/);
    assert.match(middleware, /getDashboardOverviewRedirectPath/);
    assert.match(middleware, /"\/dashboard"/);
    assert.match(middleware, /"\/dashboard\/"/);
  });
});
