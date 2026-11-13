import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  inventoryPageSectionClass,
  inventoryTableShellClass,
  inventoryTableToolbarClass,
} from "./inventoryPageClasses";

test("inventory page uses the orders v2 section and table chrome", () => {
  const orders = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersV2.tsx",
    "utf8",
  );
  const ordersTable = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersTableV2.tsx",
    "utf8",
  );
  assert.equal(orders.includes(inventoryPageSectionClass), true);
  assert.equal(ordersTable.includes(inventoryTableShellClass), true);
  assert.equal(ordersTable.includes(inventoryTableToolbarClass), true);
});
