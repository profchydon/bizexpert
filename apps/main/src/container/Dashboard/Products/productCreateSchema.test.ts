import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productCreateSchema,
  toProductCreatePayload,
} from "./productCreateSchema";

test("toProductCreatePayload sends variants when hasVariants is true", () => {
  const payload = toProductCreatePayload({
    name: "T-Shirt",
    kind: "product",
    category: "Apparel",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: true,
    variants: [
      {
        name: "Small",
        sellingPrice: 5000,
        purchaseCost: 3000,
        openingStock: [
          {
            locationId: "11111111-1111-1111-1111-111111111111",
            quantity: 4,
          },
        ],
      },
    ],
  });
  assert.equal(payload.hasVariants, true);
  assert.equal(payload.variants?.[0]?.name, "Small");
  assert.equal(payload.sellingPrice, undefined);
  assert.equal(payload.purchaseCost, undefined);
});

test("productCreateSchema requires prices for a simple product", () => {
  const parsed = productCreateSchema.safeParse({
    name: "Soap",
    kind: "product",
    baseUnit: "piece",
    imageUrl: "",
    locationIds: ["11111111-1111-1111-1111-111111111111"],
    hasVariants: false,
    sellingPrice: 0,
    purchaseCost: 0,
  });
  assert.equal(parsed.success, false);
});
