import assert from "node:assert/strict";
import { test } from "node:test";
import type { PaymentListItem } from "@/types/bizexpert";
import { filterPaymentsBySearch } from "./filterPaymentsBySearch";

const rows: PaymentListItem[] = [
  {
    id: "1",
    saleId: "s1",
    amount: 50,
    method: "cash",
    reference: "POS-9",
    paidAt: "2026-11-08T00:00:00.000Z",
    sale: {
      id: "s1",
      saleNumber: "S-10",
      customerName: "Ada",
      locationId: "l1",
      paymentStatus: "partial",
      totalAmount: 80,
      status: "completed",
      location: { id: "l1", name: "Ikeja Shop" },
    },
  },
  {
    id: "2",
    saleId: "s2",
    amount: 20,
    method: "transfer",
    paidAt: "2026-11-08T00:00:00.000Z",
    sale: {
      id: "s2",
      saleNumber: "S-11",
      customerName: "Bola",
      locationId: "l2",
      paymentStatus: "paid",
      totalAmount: 20,
      status: "completed",
      location: { id: "l2", name: "Lagos Warehouse" },
    },
  },
];

test("filterPaymentsBySearch matches sale number customer method and store", () => {
  assert.equal(filterPaymentsBySearch(rows, "S-10").length, 1);
  assert.equal(filterPaymentsBySearch(rows, "bola").length, 1);
  assert.equal(filterPaymentsBySearch(rows, "transfer").length, 1);
  assert.equal(filterPaymentsBySearch(rows, "ikeja").length, 1);
  assert.equal(filterPaymentsBySearch(rows, "POS-9").length, 1);
  assert.equal(filterPaymentsBySearch(rows, "").length, 2);
});
