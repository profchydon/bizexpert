import assert from "node:assert/strict";
import { test } from "node:test";
import type { Sale } from "@/types/bizexpert";
import {
  createPaymentSchema,
  toCreatePaymentPayload,
  unpaidSaleLabel,
  unpaidSalesForPayment,
} from "./paymentSchema";

function sale(overrides: Partial<Sale>): Sale {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    saleNumber: "S-1",
    businessId: "b1",
    locationId: "l1",
    userId: "u1",
    source: "web",
    status: "completed",
    subtotal: 100,
    discountAmount: 0,
    totalAmount: 100,
    totalCost: 40,
    grossProfit: 60,
    paymentStatus: "credit",
    customerName: "Ada",
    createdAt: "2026-11-08T00:00:00.000Z",
    updatedAt: "2026-11-08T00:00:00.000Z",
    payments: [],
    ...overrides,
  };
}

test("createPaymentSchema requires a sale amount and method", () => {
  assert.equal(
    createPaymentSchema.safeParse({
      saleId: "",
      amount: 10,
      method: "cash",
    }).success,
    false,
  );
  assert.equal(
    createPaymentSchema.safeParse({
      saleId: "11111111-1111-4111-8111-111111111111",
      amount: 0,
      method: "cash",
    }).success,
    false,
  );
  assert.equal(
    createPaymentSchema.safeParse({
      saleId: "11111111-1111-4111-8111-111111111111",
      amount: 50,
      method: "transfer",
    }).success,
    true,
  );
});

test("toCreatePaymentPayload omits a blank reference", () => {
  assert.deepEqual(
    toCreatePaymentPayload({
      saleId: "11111111-1111-4111-8111-111111111111",
      amount: 50,
      method: "pos",
      reference: "  ",
    }),
    { amount: 50, method: "pos", reference: undefined },
  );
});

test("unpaid sales exclude paid and cancelled rows", () => {
  const unpaid = unpaidSalesForPayment([
    sale({ id: "a" }),
    sale({
      id: "b",
      paymentStatus: "paid",
      payments: [
        {
          id: "p1",
          saleId: "b",
          amount: 100,
          method: "cash",
          paidAt: "2026-11-08T00:00:00.000Z",
        },
      ],
    }),
    sale({ id: "c", status: "cancelled" }),
  ]);
  assert.deepEqual(
    unpaid.map((row) => row.id),
    ["a"],
  );
});

test("unpaid sale label shows number customer and amount due", () => {
  assert.match(unpaidSaleLabel(sale({})), /S-1 · Ada · .+100.+due/);
  assert.match(
    unpaidSaleLabel(sale({ customerName: "" })),
    /S-1 · Walk-in · .+100.+due/,
  );
});
