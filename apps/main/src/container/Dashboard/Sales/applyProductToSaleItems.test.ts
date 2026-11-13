import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "@/types/bizexpert";
import { applyProductToSaleItems } from "./applyProductToSaleItems";
import { saleFormDefaults } from "./saleSchema";

const product: Product = {
  id: "p1",
  businessId: "b",
  name: "Rice 50kg",
  sellingPrice: "18000",
  purchaseCost: 12000,
  baseUnit: "bag",
  lowStockThreshold: 2,
  isActive: true,
};

test("applyProductToSaleItems fills the first empty line", () => {
  const next = applyProductToSaleItems(saleFormDefaults.items, product);
  assert.equal(next.length, 1);
  assert.equal(next[0].productId, "p1");
  assert.equal(next[0].unitName, "bag");
  assert.equal(next[0].unitPrice, 18000);
});

test("applyProductToSaleItems appends when every line has a product", () => {
  const filled = [
    {
      productId: "p0",
      quantity: 1,
      unitName: "piece",
      unitPrice: 10,
      discountAmount: 0,
    },
  ];
  const next = applyProductToSaleItems(filled, product);
  assert.equal(next.length, 2);
  assert.equal(next[1].productId, "p1");
});
