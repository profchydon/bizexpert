import assert from "node:assert/strict";
import { test } from "node:test";
import {
  toAdjustPayload,
  toOpeningPayload,
  toReceivePayload,
  toTransferPayload,
} from "./inventoryPayloads";

test("toOpeningPayload includes location, product, quantity, and unit cost", () => {
  assert.deepEqual(
    toOpeningPayload("loc-1", {
      productId: "prod-1",
      quantity: 12,
      unitCost: 4.5,
      notes: "ignored",
    }),
    {
      locationId: "loc-1",
      productId: "prod-1",
      quantity: 12,
      unitCost: 4.5,
    },
  );
});

test("toReceivePayload keeps optional notes", () => {
  const payload = toReceivePayload("loc-1", {
    productId: "prod-1",
    quantity: 3,
    unitCost: 10,
    notes: "  pallet  ",
  });
  assert.equal(payload.notes, "pallet");
});

test("toAdjustPayload trims reason", () => {
  assert.deepEqual(
    toAdjustPayload("loc-1", {
      productId: "prod-1",
      quantity: -2,
      reason: "  breakage  ",
    }),
    {
      locationId: "loc-1",
      productId: "prod-1",
      quantity: -2,
      reason: "breakage",
    },
  );
});

test("toTransferPayload wraps a single item", () => {
  const payload = toTransferPayload({
    sourceLocationId: "a",
    destinationLocationId: "b",
    productId: "prod-1",
    quantity: 5,
    notes: "",
  });
  assert.deepEqual(payload.items, [{ productId: "prod-1", quantity: 5 }]);
  assert.equal(payload.notes, undefined);
});
