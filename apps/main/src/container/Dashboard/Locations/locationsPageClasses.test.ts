import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  locationsPageSectionClass,
  locationsTableShellClass,
  locationsTableToolbarClass,
} from "./locationsPageClasses";

test("locations page uses the orders v2 section spacing", () => {
  const orders = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersV2.tsx",
    "utf8",
  );
  assert.equal(orders.includes(locationsPageSectionClass), true);
});

test("locations table uses the orders v2 table shell and toolbar", () => {
  const ordersTable = readFileSync(
    "src/container/Dashboard/Orders/v2/OrdersTableV2.tsx",
    "utf8",
  );
  assert.equal(ordersTable.includes(locationsTableShellClass), true);
  assert.equal(ordersTable.includes(locationsTableToolbarClass), true);
});
