import assert from "node:assert/strict";
import { test } from "node:test";
import type { PaymentListItem } from "@/types/bizexpert";
import { buildPaymentTransactionMetrics } from "./paymentTransactionMetrics";

const rows: PaymentListItem[] = [
  {
    id: "1",
    saleId: "s1",
    amount: "34500",
    method: "cash",
    paidAt: "2026-10-28T10:00:00.000Z",
  },
  {
    id: "2",
    saleId: "s2",
    amount: 1500,
    method: "transfer",
    paidAt: "2026-10-28T12:00:00.000Z",
  },
];

test("sums inflow credits for the transactions register", () => {
  const empty = buildPaymentTransactionMetrics([]);
  assert.equal(empty[0]?.title, "Inflow");
  assert.equal(empty[0]?.hint, "0 credits");
  assert.equal(empty[1]?.title, "Transactions");
  assert.equal(empty[1]?.value, "0");

  const filled = buildPaymentTransactionMetrics(rows);
  assert.equal(filled[0]?.hint, "2 credits");
  assert.equal(filled[1]?.value, "2");
  assert.match(filled[0]?.value ?? "", /36[,.]?000|36000/);
});
