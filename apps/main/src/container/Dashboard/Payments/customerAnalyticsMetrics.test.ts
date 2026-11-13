import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCustomerAnalyticsMetrics,
  toCustomerAnalyticsChartRows,
} from "./customerAnalyticsMetrics";

test("buildCustomerAnalyticsMetrics maps Lumi customer cards", () => {
  const metrics = buildCustomerAnalyticsMetrics({
    totalCustomers: 12,
    newCustomers: 3,
    returningCustomers: 4,
    averageSpend: 1500,
    series: [],
    topCustomers: [],
  });
  assert.equal(metrics[0]?.value, "12");
  assert.equal(metrics[1]?.value, "3");
  assert.equal(metrics[2]?.value, "4");
  assert.match(metrics[3]?.value ?? "", /1,500/);
});

test("toCustomerAnalyticsChartRows adds day labels", () => {
  const rows = toCustomerAnalyticsChartRows([
    { period: new Date(2026, 10, 8), spend: 200, customers: 2 },
  ]);
  assert.equal(rows[0]?.label, "8 Nov");
  assert.equal(rows[0]?.spend, 200);
});
