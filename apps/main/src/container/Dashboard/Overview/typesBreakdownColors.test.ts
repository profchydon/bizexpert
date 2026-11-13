import assert from "node:assert/strict";
import { test } from "node:test";
import {
  TYPES_BREAKDOWN_COLORS,
  toTypesBreakdownChartData,
} from "./typesBreakdownColors";

test("toTypesBreakdownChartData ranks types by count before coloring", () => {
  const chart = toTypesBreakdownChartData([
    { category: "Tablet", count: 2 },
    { category: "Laptop", count: 20 },
    { category: "Phone", count: 8 },
  ]);

  assert.deepEqual(
    chart.map((item) => item.category),
    ["Laptop", "Phone", "Tablet"],
  );
  assert.equal(chart[0]?.fill, TYPES_BREAKDOWN_COLORS[0]);
  assert.equal(chart[1]?.fill, TYPES_BREAKDOWN_COLORS[1]);
});

test("toTypesBreakdownChartData wraps the brand palette", () => {
  const chart = toTypesBreakdownChartData(
    Array.from({ length: 6 }, (_, index) => ({
      category: `Type ${index}`,
      count: 6 - index,
    })),
  );

  assert.equal(chart[5]?.fill, TYPES_BREAKDOWN_COLORS[0]);
});
