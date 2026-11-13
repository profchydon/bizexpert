import assert from "node:assert/strict";
import { test } from "node:test";
import type { Sale } from "@/types/bizexpert";
import { buildSalesListMetrics } from "./saleListMetrics";

function sale(overrides: Partial<Sale> = {}): Sale {
  return {
    id: "s1",
    saleNumber: "SAL-1",
    businessId: "b",
    locationId: "l",
    userId: "u",
    source: "web",
    status: "completed",
    subtotal: 1000,
    discountAmount: 0,
    totalAmount: 1000,
    totalCost: 400,
    grossProfit: 600,
    paymentStatus: "paid",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

test("buildSalesListMetrics totals completed sales only", () => {
  const metrics = buildSalesListMetrics([
    sale(),
    sale({
      id: "s2",
      status: "cancelled",
      totalAmount: 500,
      grossProfit: 100,
    }),
    sale({
      id: "s3",
      totalAmount: 500,
      grossProfit: 200,
      paymentStatus: "credit",
    }),
  ]);
  const revenue = metrics.find((row) => row.id === "revenue");
  const profit = metrics.find((row) => row.id === "profit");
  const outstanding = metrics.find((row) => row.id === "credit");
  assert.match(revenue?.value ?? "", /1,500/);
  assert.equal(revenue?.hint, "2 completed");
  assert.match(profit?.value ?? "", /800/);
  assert.match(outstanding?.value ?? "", /500/);
});
