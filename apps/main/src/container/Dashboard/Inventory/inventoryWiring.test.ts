import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("inventory page is wired to the Remote inventory container", () => {
  const page = readFileSync("src/app/dashboard/inventory/page.tsx", "utf8");
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/Inventory"), true);
});

test("products for inventory actions use the API max page size", () => {
  const queries = readFileSync(
    "src/container/Dashboard/Inventory/useInventoryQueries.ts",
    "utf8",
  );
  assert.equal(queries.includes("limit: 100"), true);
  assert.equal(queries.includes("limit: 300"), false);
});

test("inventory mutations call the inventory and stocktake APIs", () => {
  const mutations = readFileSync(
    "src/container/Dashboard/Inventory/useInventoryMutations.ts",
    "utf8",
  );
  assert.equal(mutations.includes("/opening-stock"), true);
  assert.equal(mutations.includes("/receive"), true);
  assert.equal(mutations.includes("/adjust"), true);
  assert.equal(mutations.includes("/transfer"), true);
  assert.equal(mutations.includes("/transfers/${transferId}/receive"), true);
  assert.equal(mutations.includes("/transfers/${transferId}/cancel"), true);
  assert.equal(mutations.includes("/stocktakes"), true);
});

test("stocktake detail can save, submit, approve, and reject", () => {
  const detail = readFileSync(
    "src/container/Dashboard/Inventory/StocktakeDetail/useStocktakeDetail.ts",
    "utf8",
  );
  assert.equal(detail.includes("/counts"), true);
  assert.equal(detail.includes("/submit"), true);
  assert.equal(detail.includes("/approve"), true);
  assert.equal(detail.includes("/reject"), true);
});
