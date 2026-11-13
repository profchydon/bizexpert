import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addPaymentSchema,
  cancelSaleSchema,
  refundSaleSchema,
  shareWhatsappSchema,
} from "./saleActionSchemas";

test("cancelSaleSchema requires a reason of at least 3 characters", () => {
  assert.equal(cancelSaleSchema.safeParse({ reason: "no" }).success, false);
  assert.equal(
    cancelSaleSchema.safeParse({ reason: "out of stock" }).success,
    true,
  );
});

test("refundSaleSchema requires a reason and optional returnGoods", () => {
  assert.equal(refundSaleSchema.safeParse({ reason: "" }).success, false);
  const parsed = refundSaleSchema.safeParse({
    reason: "damaged",
    returnGoods: true,
  });
  assert.equal(parsed.success, true);
});

test("addPaymentSchema requires a positive amount and method", () => {
  assert.equal(
    addPaymentSchema.safeParse({ amount: 0, method: "cash" }).success,
    false,
  );
  assert.equal(
    addPaymentSchema.safeParse({ amount: 500, method: "transfer" }).success,
    true,
  );
});

test("shareWhatsappSchema requires a phone number", () => {
  assert.equal(shareWhatsappSchema.safeParse({ phone: "123" }).success, false);
  assert.equal(
    shareWhatsappSchema.safeParse({ phone: "2348011112222" }).success,
    true,
  );
});
