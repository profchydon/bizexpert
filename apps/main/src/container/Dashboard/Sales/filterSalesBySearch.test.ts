import assert from "node:assert/strict";
import { test } from "node:test";
import type { Sale } from "@/types/bizexpert";
import { filterSalesBySearch } from "./filterSalesBySearch";

const rows: Sale[] = [
  {
    id: "1",
    saleNumber: "SAL-1001",
    businessId: "b",
    locationId: "l1",
    userId: "u",
    source: "web",
    status: "completed",
    subtotal: 1000,
    discountAmount: 0,
    totalAmount: 1000,
    totalCost: 400,
    grossProfit: 600,
    paymentStatus: "paid",
    customerName: "Adaeze Okonkwo",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    location: { id: "l1", name: "Lekki store" },
  },
  {
    id: "2",
    saleNumber: "SAL-1002",
    businessId: "b",
    locationId: "l2",
    userId: "u",
    source: "whatsapp",
    status: "cancelled",
    subtotal: 500,
    discountAmount: 0,
    totalAmount: 500,
    totalCost: 200,
    grossProfit: 300,
    paymentStatus: "credit",
    customerName: "Bola Ahmed",
    createdAt: "2026-01-02",
    updatedAt: "2026-01-02",
  },
];

test("filterSalesBySearch matches number customer status and store", () => {
  assert.equal(filterSalesBySearch(rows, "sal-1001").length, 1);
  assert.equal(filterSalesBySearch(rows, "bola").length, 1);
  assert.equal(filterSalesBySearch(rows, "cancelled").length, 1);
  assert.equal(filterSalesBySearch(rows, "lekki").length, 1);
  assert.equal(filterSalesBySearch(rows, "").length, 2);
});
