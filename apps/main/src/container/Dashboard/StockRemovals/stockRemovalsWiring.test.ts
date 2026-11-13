import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

test("stock removals page is wired to the StockRemovals container", () => {
  const page = readFileSync(
    "src/app/dashboard/inventory/stock-removals/page.tsx",
    "utf8",
  );
  assert.equal(page.includes("DashboardSectionPlaceholder"), false);
  assert.equal(page.includes("@/container/Dashboard/StockRemovals"), true);
});

test("stock removals list damage movements and post adjust", () => {
  const table = readFileSync(
    "src/container/Dashboard/StockRemovals/StockRemovalsTable.tsx",
    "utf8",
  );
  const form = readFileSync(
    "src/container/Dashboard/StockRemovals/StockRemovalFormSlideout.tsx",
    "utf8",
  );
  assert.equal(table.includes("/inventory/movements"), true);
  assert.equal(table.includes('type: "damage"'), true);
  assert.equal(form.includes("/inventory/adjust"), true);
  assert.equal(form.includes("toStockRemovalPayload"), true);
});
