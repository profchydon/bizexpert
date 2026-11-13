import { test } from "node:test";
import assert from "node:assert";
import { buildInventoryOverviewMetrics } from "./inventoryOverviewMetrics";

test("buildInventoryOverviewMetrics prefers collection revenue", () => {
  const metrics = buildInventoryOverviewMetrics(
    { totalRevenue: 100, grossProfit: 40, completedSalesCount: 3 },
    {
      totalRevenue: 200,
      cashCollected: 150,
      outstandingCredit: 50,
    },
  );
  const revenue = metrics.find((m) => m.id === "revenue");
  assert.match(revenue?.value ?? "", /200/);
});

test("buildInventoryOverviewMetrics includes inventory value and margin", () => {
  const metrics = buildInventoryOverviewMetrics(
    {
      totalRevenue: 200,
      grossProfit: 80,
      grossMarginPct: 40,
      completedSalesCount: 4,
      averageOrderValue: 50,
    },
    { totalRevenue: 200, cashCollected: 120, outstandingCredit: 80 },
    1500,
  );
  const profit = metrics.find((m) => m.id === "profit");
  const inventory = metrics.find((m) => m.id === "inventory");
  assert.equal(profit?.hint, "40% margin");
  assert.match(inventory?.value ?? "", /1,500/);
  assert.equal(inventory?.hint, "Weighted-average cost");
});
