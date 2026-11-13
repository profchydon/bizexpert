import assert from "node:assert/strict";
import { test } from "node:test";
import {
  stockRemovalFormSchema,
  toStockRemovalPayload,
  removedQuantity,
} from "./stockRemovalSchema";

const locationId = "11111111-1111-4111-8111-111111111111";
const productId = "22222222-2222-4222-8222-222222222222";

test("toStockRemovalPayload sends a negative damage adjustment", () => {
  const payload = toStockRemovalPayload({
    locationId,
    productId,
    quantity: 3,
    reason: "Expired",
    notes: "  past date  ",
  });
  assert.equal(payload.quantity, -3);
  assert.equal(payload.movementType, "damage");
  assert.equal(payload.reason, "Expired: past date");
  assert.equal(payload.locationId, locationId);
});

test("toStockRemovalPayload omits blank notes", () => {
  const payload = toStockRemovalPayload({
    locationId,
    productId,
    quantity: 1,
    reason: "Damaged",
    notes: "  ",
  });
  assert.equal(payload.reason, "Damaged");
});

test("stockRemovalFormSchema requires notes when reason is Other", () => {
  const missing = stockRemovalFormSchema.safeParse({
    locationId,
    productId,
    quantity: 1,
    reason: "Other",
    notes: "",
  });
  assert.equal(missing.success, false);
  const ok = stockRemovalFormSchema.safeParse({
    locationId,
    productId,
    quantity: 1,
    reason: "Other",
    notes: "write-off",
  });
  assert.equal(ok.success, true);
});

test("removedQuantity is always positive", () => {
  assert.equal(removedQuantity(-4), 4);
  assert.equal(removedQuantity("2.5"), 2.5);
});
