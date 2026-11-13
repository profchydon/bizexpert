import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  overviewPageIsError,
  overviewPageIsLoading,
  shouldBlockOverviewOnDashboardError,
  shouldRenderEntityOverview,
} from "./overviewPageState";

describe("overviewPageState", () => {
  it("keeps an entity workspace on screen when dashboard errors", () => {
    assert.equal(shouldBlockOverviewOnDashboardError("entity"), false);
    assert.equal(shouldRenderEntityOverview("entity", "entity-1"), true);
    assert.equal(
      overviewPageIsError({ tier: "entity", dashboardError: true }),
      false,
    );
    assert.equal(
      overviewPageIsLoading({
        tier: "entity",
        dashboardLoading: true,
        hasDashboardData: false,
      }),
      false,
    );
  });

  it("still uses PageState for global and office dashboard failures", () => {
    assert.equal(shouldBlockOverviewOnDashboardError("global"), true);
    assert.equal(shouldBlockOverviewOnDashboardError("office"), true);
    assert.equal(
      overviewPageIsError({ tier: "global", dashboardError: true }),
      true,
    );
    assert.equal(
      overviewPageIsLoading({
        tier: "global",
        dashboardLoading: true,
        hasDashboardData: false,
      }),
      true,
    );
  });
});
