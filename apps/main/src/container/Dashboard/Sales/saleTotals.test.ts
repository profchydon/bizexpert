import assert from "node:assert/strict";
import { test } from "node:test";
import type { Sale } from "@/types/bizexpert";
import {
  canAddPayment,
  canCancelSale,
  canRefundSale,
  saleOutstanding,
  salePaidTotal,
} from "./saleTotals";

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
    paymentStatus: "partial",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    payments: [
      {
        id: "p1",
        saleId: "s1",
        amount: 400,
        method: "cash",
        paidAt: "2026-01-01",
      },
    ],
    ...overrides,
  };
}

test("salePaidTotal and saleOutstanding use payment amounts", () => {
  const row = sale();
  assert.equal(salePaidTotal(row), 400);
  assert.equal(saleOutstanding(row), 600);
});

test("completed unpaid sales can be paid cancelled or refunded", () => {
  const row = sale();
  assert.equal(canAddPayment(row), true);
  assert.equal(canCancelSale(row), true);
  assert.equal(canRefundSale(row), true);
});

test("cancelled sales cannot take payment cancel or refund", () => {
  const row = sale({ status: "cancelled", paymentStatus: "paid" });
  assert.equal(canAddPayment(row), false);
  assert.equal(canCancelSale(row), false);
  assert.equal(canRefundSale(row), false);
});

test("fully paid sales cannot add another payment", () => {
  const row = sale({
    paymentStatus: "paid",
    payments: [
      {
        id: "p1",
        saleId: "s1",
        amount: 1000,
        method: "cash",
        paidAt: "2026-01-01",
      },
    ],
  });
  assert.equal(canAddPayment(row), false);
});
