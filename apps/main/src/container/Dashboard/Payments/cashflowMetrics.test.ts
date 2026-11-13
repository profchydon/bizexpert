import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCashflowMetrics, toCashflowChartRows } from "./cashflowMetrics";

test("buildCashflowMetrics shows inflow outflow and net", () => {
  const metrics = buildCashflowMetrics({
    inflowAmount: 199,
    inflowCount: 11,
    outflowAmount: 60,
    outflowCount: 2,
    series: [],
  });
  assert.match(metrics[0]?.value ?? "", /199/);
  assert.equal(metrics[0]?.hint, "11 payments");
  assert.match(metrics[1]?.value ?? "", /60/);
  assert.equal(metrics[1]?.hint, "2 purchases");
  assert.match(metrics[2]?.value ?? "", /139/);
});

test("toCashflowChartRows adds day labels", () => {
  const rows = toCashflowChartRows([
    {
      period: new Date(2026, 10, 8),
      inflowAmount: 10,
      inflowCount: 1,
      outflowAmount: 2,
      outflowCount: 1,
    },
  ]);
  assert.equal(rows[0]?.label, "8 Nov");
  assert.equal(rows[0]?.inflowAmount, 10);
});
