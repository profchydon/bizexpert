import assert from "node:assert/strict";
import { test } from "node:test";
import type { Category } from "@/types/bizexpert";
import {
  mainCategories,
  sortCategoriesForTable,
  subCategoriesForParent,
} from "./categoryHierarchyDisplay";

const sample: Category[] = [
  {
    id: "1",
    businessId: "b",
    name: "Beverages",
    productCount: 2,
    parentId: null,
  },
  {
    id: "2",
    businessId: "b",
    name: "Cola",
    productCount: 1,
    parentId: "1",
    parentName: "Beverages",
  },
  {
    id: "3",
    businessId: "b",
    name: "Food",
    productCount: 0,
    parentId: null,
  },
];

test("mainCategories returns only roots", () => {
  assert.deepEqual(
    mainCategories(sample).map((row) => row.name),
    ["Beverages", "Food"],
  );
});

test("sortCategoriesForTable nests subs under mains", () => {
  assert.deepEqual(
    sortCategoriesForTable(sample).map((row) => row.name),
    ["Beverages", "Cola", "Food"],
  );
});

test("subCategoriesForParent lists children", () => {
  assert.equal(subCategoriesForParent(sample, "1").length, 1);
});
