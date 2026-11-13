import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canConfirmCategoryDelete,
  categoryDeleteDescription,
  categoryDeleteTitle,
} from "./deleteCategoryCopy";

test("delete category copy names the category and blocks in-use rows", () => {
  assert.equal(categoryDeleteTitle(), "Delete category");
  assert.equal(
    categoryDeleteDescription("Drinks", 0),
    "This will remove Drinks from your categories.",
  );
  assert.equal(
    categoryDeleteDescription("Drinks", 1),
    "Drinks is used by 1 product and cannot be deleted.",
  );
  assert.equal(
    categoryDeleteDescription("Food", 3),
    "Food is used by 3 products and cannot be deleted.",
  );
  assert.equal(canConfirmCategoryDelete(0), true);
  assert.equal(canConfirmCategoryDelete(2), false);
});
