import assert from "node:assert/strict";
import { test } from "node:test";
import { INVENTORY_TABS, isInventoryTab } from "./inventoryTabs";

test("inventory view tabs are balances, transfers, movements, and stocktake", () => {
  assert.deepEqual(
    INVENTORY_TABS.map((tab) => tab.id),
    ["balances", "transfers", "movements", "stocktake"],
  );
});

test("isInventoryTab accepts only view tabs", () => {
  assert.equal(isInventoryTab("balances"), true);
  assert.equal(isInventoryTab("receive"), false);
});
