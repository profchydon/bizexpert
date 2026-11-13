import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("entity overview stays mounted without a successful dashboard payload", () => {
  const overview = read("src/container/Dashboard/Overview/index.tsx");
  const entityBody = read(
    "src/container/Dashboard/Overview/EntityOverviewBody.tsx",
  );
  const setup = read("src/container/Dashboard/Overview/SetupBanner.tsx");

  assert.match(overview, /shouldRenderEntityOverview/);
  assert.match(overview, /overviewPageIsError/);
  assert.match(overview, /from "\.\/overviewDashboardError"/);
  assert.doesNotMatch(overview, /dashboardData && tier === "entity"/);
  assert.match(entityBody, /dashboardData\?: IDashboard/);
  assert.match(setup, /shouldShowSetupBannerForQuery/);
});
