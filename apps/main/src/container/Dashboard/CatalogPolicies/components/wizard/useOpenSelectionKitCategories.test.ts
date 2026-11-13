import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { uniqueKitCategoryIds } from "./useOpenSelectionKitCategories.utils";

describe("open selection kit categories", () => {
  it("dedupes category ids from selected kit category lookup responses", () => {
    assert.deepEqual(
      uniqueKitCategoryIds([
        {
          categories: [
            { id: "category-1", name: "Laptop" },
            { id: "category-2", name: "Monitor" },
          ],
        },
        {
          categories: [
            { id: "category-2", name: "Monitor" },
            { id: "category-3", name: "Phone" },
          ],
        },
      ]),
      ["category-1", "category-2", "category-3"],
    );
  });
});
