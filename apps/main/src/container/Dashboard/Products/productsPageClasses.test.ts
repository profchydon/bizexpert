import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  productsPageSectionClass,
  productsTableShellClass,
  productsTableToolbarClass,
} from "./productsPageClasses";

test("products page uses the orders v2 section and table chrome", () => {
  const orders = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersV2.tsx",
    "utf8",
  );
  const ordersTable = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersTableV2.tsx",
    "utf8",
  );
  assert.equal(orders.includes(productsPageSectionClass), true);
  assert.equal(ordersTable.includes(productsTableShellClass), true);
  assert.equal(ordersTable.includes(productsTableToolbarClass), true);
});
