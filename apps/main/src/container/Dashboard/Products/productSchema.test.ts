import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "@/types/bizexpert";
import {
  toCreateProductPayload,
  toUpdateProductPayload,
  valuesFromProduct,
} from "./productSchema";

const product: Product = {
  id: "p1",
  businessId: "b1",
  name: "Rice 50kg",
  sku: "RICE-50",
  category: "Grains",
  sellingPrice: "12000.00",
  purchaseCost: "9000.00",
  baseUnit: "bag",
  lowStockThreshold: "4",
  isActive: true,
};

test("valuesFromProduct maps decimal strings", () => {
  const values = valuesFromProduct(product);
  assert.equal(values.sellingPrice, 12000);
  assert.equal(values.purchaseCost, 9000);
  assert.equal(values.lowStockThreshold, 4);
  assert.equal(values.barcode, "");
});

test("toCreateProductPayload drops blank optional fields", () => {
  const payload = toCreateProductPayload({
    name: "  Soap  ",
    sku: "  ",
    barcode: "",
    category: "Household",
    sellingPrice: 250,
    purchaseCost: 180,
    baseUnit: "piece",
    lowStockThreshold: 5,
  });
  assert.equal(payload.name, "Soap");
  assert.equal(payload.sku, undefined);
  assert.equal(payload.barcode, undefined);
  assert.equal(payload.category, "Household");
});

test("toUpdateProductPayload clears optional blanks", () => {
  const payload = toUpdateProductPayload({
    name: "Soap",
    sku: "",
    barcode: "  ",
    category: "",
    sellingPrice: 250,
    purchaseCost: 180,
    baseUnit: "piece",
    lowStockThreshold: 0,
  });
  assert.equal(payload.sku, "");
  assert.equal(payload.barcode, "");
  assert.equal(payload.category, "");
});
