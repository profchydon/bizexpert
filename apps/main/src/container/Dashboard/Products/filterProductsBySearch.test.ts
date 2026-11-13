import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "@/types/bizexpert";
import { filterProductsBySearch } from "./filterProductsBySearch";

const rows: Product[] = [
  {
    id: "1",
    businessId: "b",
    name: "Indomie",
    sku: "INDO-70",
    barcode: "8901",
    category: "Food",
    sellingPrice: 150,
    purchaseCost: 110,
    baseUnit: "piece",
    lowStockThreshold: 10,
    isActive: true,
  },
];

test("filterProductsBySearch matches name sku barcode and category", () => {
  assert.equal(filterProductsBySearch(rows, "indo").length, 1);
  assert.equal(filterProductsBySearch(rows, "indo-70").length, 1);
  assert.equal(filterProductsBySearch(rows, "8901").length, 1);
  assert.equal(filterProductsBySearch(rows, "food").length, 1);
  assert.equal(filterProductsBySearch(rows, "drink").length, 0);
});
