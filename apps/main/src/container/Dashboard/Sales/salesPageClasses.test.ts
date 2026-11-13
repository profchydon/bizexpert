import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  salesDateInputClass,
  salesMetricCardClass,
  salesMetricGridClass,
  salesTableHeaderClass,
} from "./salesPageClasses";

test("sales metrics use light cards", () => {
  assert.equal(salesMetricCardClass.includes("bg-white"), true);
  assert.equal(salesMetricCardClass.includes("ring-gray-200"), true);
  assert.equal(salesMetricGridClass.includes("xl:grid-cols-4"), true);
});

test("sales table header stacks title and filters", () => {
  assert.equal(salesTableHeaderClass.includes("flex-col"), true);
  assert.equal(salesDateInputClass.includes("h-11"), true);
  assert.equal(salesDateInputClass.includes("ring-gray-300"), true);
});

test("sales table uses metric cards and a profit column", () => {
  const table = readFileSync(
    "src/container/Dashboard/Sales/SalesTable.tsx",
    "utf8",
  );
  const columns = readFileSync(
    "src/container/Dashboard/Sales/saleColumns.tsx",
    "utf8",
  );
  const filters = readFileSync(
    "src/container/Dashboard/Sales/SalesTableFilters.tsx",
    "utf8",
  );
  assert.equal(table.includes("SalesMetricCards"), true);
  assert.equal(table.includes("salesTableToolbarClass"), false);
  assert.equal(columns.includes('header: "Profit"'), true);
  assert.equal(filters.includes("Clear"), true);
});
