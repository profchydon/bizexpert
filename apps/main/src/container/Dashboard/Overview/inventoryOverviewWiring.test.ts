import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("BizExpert overview drops Rayda metric cards", () => {
  const body = readFileSync(
    "src/container/Dashboard/Overview/InventoryOverviewBody.tsx",
    "utf8",
  );
  assert.equal(body.includes("SummaryCard"), false);
  assert.equal(body.includes("PageHeader"), true);
  assert.equal(body.includes("InventoryMetricCards"), true);
  assert.equal(body.includes("InventoryTopProductsTable"), true);
  assert.equal(body.includes("InventoryLocationTable"), true);
  assert.equal(body.includes("InventoryLowStockTable"), true);
});

test("BizExpert overview chart shows revenue and profit", () => {
  const chart = readFileSync(
    "src/container/Dashboard/Overview/InventorySalesTrendChart.tsx",
    "utf8",
  );
  assert.equal(chart.includes('dataKey="revenue"'), true);
  assert.equal(chart.includes('dataKey="profit"'), true);
  assert.equal(chart.includes("Gross profit"), true);
});

test("BizExpert overview fetches unused analytics endpoints", () => {
  const hook = readFileSync(
    "src/container/Dashboard/Overview/useInventoryOverview.ts",
    "utf8",
  );
  assert.equal(hook.includes("top-products"), true);
  assert.equal(hook.includes("inventory-valuation"), true);
  assert.equal(hook.includes("/analytics/locations"), true);
  assert.equal(hook.includes("inventoryOverviewStartDate"), true);
  assert.equal(hook.includes('groupBy: "day"'), true);
});
