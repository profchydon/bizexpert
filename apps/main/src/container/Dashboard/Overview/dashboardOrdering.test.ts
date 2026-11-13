import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard } from "@/types/dashboard";
import {
  aggregateOrderFrequency,
  dashboardOrderingFrequency,
  dashboardTypesBreakdown,
  hasOrderingFrequencyData,
  monthLabelFromIndex,
} from "./dashboardOrdering";

test("month labels come from the calendar, not a fixture list", () => {
  assert.equal(monthLabelFromIndex(1), "Jan");
  assert.equal(monthLabelFromIndex("9"), "Sep");
});

test("legacy order_frequency rows are summed by month", () => {
  assert.deepEqual(
    aggregateOrderFrequency([
      { month: "9", count: 1 },
      { month: "9", count: 2 },
      { month: "8", count: 1 },
    ]),
    [
      { month: "Sep", orders: 3 },
      { month: "Aug", orders: 1 },
    ],
  );
});

test("dashboardOrderingFrequency prefers panels.ordering.frequency", () => {
  const dashboard = {
    order_frequency: [{ month: "1", count: 99 }],
    panels: {
      ordering: {
        frequency: [
          { month: 1, label: "Jan", count: 3 },
          { month: 6, label: "Jun", count: 48 },
        ],
      },
    },
  } as IDashboard;

  assert.deepEqual(dashboardOrderingFrequency(dashboard), [
    { month: "Jan", orders: 3 },
    { month: "Jun", orders: 48 },
  ]);
});

test("dashboardTypesBreakdown prefers panels.ordering.types_breakdown", () => {
  const dashboard = {
    equipment_by_category: [{ category: "Macbook", count: 139 }],
    panels: {
      ordering: {
        frequency: [],
        types_breakdown: [
          { category: "Macbook", count: 143 },
          { category: "Phones", count: 1 },
        ],
      },
    },
  } as IDashboard;

  assert.deepEqual(dashboardTypesBreakdown(dashboard), [
    { category: "Macbook", count: 143 },
    { category: "Phones", count: 1 },
  ]);
});

test("all-zero frequency points are treated as no ordering data", () => {
  const dashboard = {
    panels: {
      ordering: {
        frequency: [
          { month: 1, label: "Jan", count: 0 },
          { month: 2, label: "Feb", count: 0 },
        ],
      },
    },
  } as IDashboard;

  assert.equal(hasOrderingFrequencyData(dashboard), false);
});

test("dashboardOrderingFrequency falls back to order_frequency", () => {
  const dashboard = {
    order_frequency: [{ month: "2", count: 4 }],
  } as IDashboard;

  assert.deepEqual(dashboardOrderingFrequency(dashboard), [
    { month: "Feb", orders: 4 },
  ]);
});
