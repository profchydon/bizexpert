import assert from "node:assert/strict";
import { test } from "node:test";
import type { Category } from "@/types/bizexpert";
import { filterCategoriesBySearch } from "./filterCategoriesBySearch";

const rows: Category[] = [
  { id: "1", businessId: "b", name: "Drinks", productCount: 2 },
  { id: "2", businessId: "b", name: "Food", productCount: 0 },
];

test("filterCategoriesBySearch matches name", () => {
  assert.equal(filterCategoriesBySearch(rows, "dri").length, 1);
  assert.equal(filterCategoriesBySearch(rows, "FOOD").length, 1);
  assert.equal(filterCategoriesBySearch(rows, "").length, 2);
});
