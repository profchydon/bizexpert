import assert from "node:assert/strict";
import { test } from "node:test";
import { officeOverviewMetrics } from "./officeOverviewMetrics";

test("officeOverviewMetrics maps snapshot counts and formatted value", () => {
  const metrics = officeOverviewMetrics({
    snapshot: {
      employees: 4,
      assets: 11,
      asset_value: 1200,
      asset_mix: [],
    },
    activeOrders: 2,
    currency: "GBP",
  });

  assert.equal(metrics[0]?.value, "4");
  assert.equal(metrics[1]?.value, "11");
  assert.equal(metrics[2]?.value, "2");
  assert.match(metrics[3]?.value ?? "", /1,200|1200/);
});

test("officeOverviewMetrics defaults missing snapshot figures to zero", () => {
  const metrics = officeOverviewMetrics({
    snapshot: undefined,
    activeOrders: 0,
    currency: "USD",
  });

  assert.deepEqual(
    metrics.map((metric) => metric.label),
    ["Employees", "Assets", "Active orders", "Asset value"],
  );
  assert.equal(metrics[0]?.value, "0");
  assert.equal(metrics[2]?.value, "0");
});
