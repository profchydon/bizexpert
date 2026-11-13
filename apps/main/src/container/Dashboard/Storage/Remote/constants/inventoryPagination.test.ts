import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  STORAGE_INVENTORY_PAGE_SIZE,
  STORAGE_INVENTORY_PAGE_SIZES,
} from "./inventoryPagination";

describe("storage inventory pagination", () => {
  it("defaults inventory list requests to 15 rows per page", () => {
    assert.equal(STORAGE_INVENTORY_PAGE_SIZE, 15);
    assert.deepEqual(STORAGE_INVENTORY_PAGE_SIZES, [15, 25, 50, 100]);
  });

  it("does not request per_page=1000 from the inventory API hook", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/hooks/useStorageInventoryApi.ts",
      ),
      "utf8",
    );

    assert.doesNotMatch(source, /per_page:\s*1000/);
    assert.match(source, /useGetInStorageInventorySummaryQuery/);
  });
});
