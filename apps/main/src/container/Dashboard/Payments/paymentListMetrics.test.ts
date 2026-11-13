import assert from "node:assert/strict";
import { test } from "node:test";
import type { PaymentListItem } from "@/types/bizexpert";
import { buildPaymentListMetrics } from "./paymentListMetrics";

const rows: PaymentListItem[] = [
  {
    id: "1",
    saleId: "s1",
    amount: "50.00",
    method: "cash",
    paidAt: "2026-11-08T00:00:00.000Z",
  },
  {
    id: "2",
    saleId: "s2",
    amount: 150,
    method: "transfer",
    paidAt: "2026-11-08T00:00:00.000Z",
  },
];

test("buildPaymentListMetrics totals received count and average", () => {
  const metrics = buildPaymentListMetrics(rows);
  assert.match(metrics[0]?.value ?? "", /200/);
  assert.equal(metrics[0]?.hint, "2 payments");
  assert.equal(metrics[1]?.value, "2");
  assert.match(metrics[2]?.value ?? "", /100/);
});

test("buildPaymentListMetrics is zero for an empty list", () => {
  const metrics = buildPaymentListMetrics([]);
  assert.match(metrics[0]?.value ?? "", /0/);
  assert.equal(metrics[0]?.hint, "0 payments");
  assert.equal(metrics[1]?.value, "0");
});
