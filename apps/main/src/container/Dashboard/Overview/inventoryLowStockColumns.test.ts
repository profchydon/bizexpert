import assert from "node:assert/strict";
import { test } from "node:test";
import { inventoryLowStockColumns } from "./inventoryLowStockColumns";
import { inventoryTopProductColumns } from "./inventoryTopProductColumns";
import { inventoryLocationColumns } from "./inventoryLocationColumns";

test("overview tables expose product store and money columns", () => {
  assert.deepEqual(
    inventoryLowStockColumns().map((column) => column.header),
    ["Product", "Store", "On hand", "Threshold"],
  );
  assert.deepEqual(
    inventoryTopProductColumns().map((column) => column.header),
    ["Product", "Qty", "Revenue", "Profit"],
  );
  assert.deepEqual(
    inventoryLocationColumns().map((column) => column.header),
    ["Store", "Sales", "Revenue", "Profit"],
  );
});
