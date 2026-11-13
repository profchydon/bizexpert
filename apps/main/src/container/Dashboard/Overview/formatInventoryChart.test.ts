import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatInventoryAxisAmount,
  formatInventoryChartPeriod,
  toInventoryChartRows,
} from "./formatInventoryChart";

test("formatInventoryChartPeriod uses day and month", () => {
  assert.equal(formatInventoryChartPeriod(new Date(2026, 10, 8)), "8 Nov");
});

test("formatInventoryChartPeriod keeps invalid values", () => {
  assert.equal(formatInventoryChartPeriod("not-a-date"), "not-a-date");
});

test("toInventoryChartRows adds labels", () => {
  const rows = toInventoryChartRows([
    { period: new Date(2026, 10, 8), revenue: 100, profit: 40 },
  ]);
  assert.equal(rows[0]?.label, "8 Nov");
  assert.equal(rows[0]?.revenue, 100);
});

test("formatInventoryAxisAmount uses compact notation", () => {
  assert.equal(formatInventoryAxisAmount(0), "0");
  assert.equal(formatInventoryAxisAmount(1500).includes("₦"), false);
});
