import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EMPTY_ENTITY_DASHBOARD,
  resolveOverviewDashboardData,
  shouldBlockOverviewOnDashboardError,
} from "./overviewDashboardError";

test("entity overview does not full-page error when the dashboard query fails", () => {
  assert.equal(shouldBlockOverviewOnDashboardError(true, "entity-1"), false);
  assert.equal(shouldBlockOverviewOnDashboardError(true, null), true);
  assert.equal(shouldBlockOverviewOnDashboardError(false, "entity-1"), false);
});

test("entity overview falls back to an empty dashboard when the query errors", () => {
  const live = {
    ...EMPTY_ENTITY_DASHBOARD,
    cards: { ...EMPTY_ENTITY_DASHBOARD.cards, total_inventory: 4 },
  };

  assert.equal(resolveOverviewDashboardData(live, true, "entity-1"), live);
  assert.equal(
    resolveOverviewDashboardData(undefined, true, "entity-1"),
    EMPTY_ENTITY_DASHBOARD,
  );
  assert.equal(resolveOverviewDashboardData(undefined, true, null), undefined);
  assert.equal(
    resolveOverviewDashboardData(undefined, false, "entity-1"),
    undefined,
  );
});
