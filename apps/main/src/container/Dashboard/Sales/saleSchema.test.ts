import assert from "node:assert/strict";
import { test } from "node:test";
import { saleFormSchema, toCreateSalePayload } from "./saleSchema";

const locationId = "11111111-1111-4111-8111-111111111111";
const productId = "22222222-2222-4222-8222-222222222222";
const customerId = "33333333-3333-4333-8333-333333333333";

test("toCreateSalePayload drops blank optional fields", () => {
  const payload = toCreateSalePayload({
    locationId,
    customerId: "",
    customerName: "  Ada  ",
    paymentMethod: "cash",
    paymentReference: "  ",
    notes: "",
    discountAmount: 0,
    items: [
      {
        productId,
        quantity: 2,
        unitName: "carton",
        unitPrice: "",
        discountAmount: 0,
      },
    ],
  });
  assert.equal(payload.locationId, locationId);
  assert.equal(payload.customerId, undefined);
  assert.equal(payload.customerName, "Ada");
  assert.equal(payload.paymentMethod, "cash");
  assert.equal(payload.paymentReference, undefined);
  assert.equal(payload.discountAmount, undefined);
  assert.equal(payload.items[0].unitPrice, undefined);
  assert.equal(payload.items[0].quantity, 2);
});

test("toCreateSalePayload keeps customer and unit price", () => {
  const payload = toCreateSalePayload({
    locationId,
    customerId,
    customerName: "",
    paymentMethod: "transfer",
    paymentReference: "REF-1",
    notes: "Paid",
    discountAmount: 50,
    items: [
      {
        productId,
        quantity: 1,
        unitName: "piece",
        unitPrice: 1200,
        discountAmount: 10,
      },
    ],
  });
  assert.equal(payload.customerId, customerId);
  assert.equal(payload.items[0].unitPrice, 1200);
  assert.equal(payload.discountAmount, 50);
});

test("saleFormSchema rejects a sale with no items", () => {
  const parsed = saleFormSchema.safeParse({
    locationId,
    items: [],
  });
  assert.equal(parsed.success, false);
});

test("saleFormSchema rejects a missing product", () => {
  const parsed = saleFormSchema.safeParse({
    locationId,
    items: [{ productId: "", quantity: 1 }],
  });
  assert.equal(parsed.success, false);
});
