import assert from "node:assert/strict";
import { test } from "node:test";
import type { StockMovement } from "@/types/bizexpert";
import { filterStockRemovalsBySearch } from "./filterStockRemovalsBySearch";

const rows: StockMovement[] = [
  {
    id: "1",
    type: "damage",
    quantity: -2,
    createdAt: "2026-01-01",
    reason: "Expired",
    product: { name: "Rice 50kg" },
    location: { name: "Lekki store" },
  },
  {
    id: "2",
    type: "damage",
    quantity: -1,
    createdAt: "2026-01-02",
    reason: "Damaged",
    product: { name: "Palm oil" },
    location: { name: "Ikeja" },
  },
];

test("filterStockRemovalsBySearch matches product reason and store", () => {
  assert.equal(filterStockRemovalsBySearch(rows, "rice").length, 1);
  assert.equal(filterStockRemovalsBySearch(rows, "damaged").length, 1);
  assert.equal(filterStockRemovalsBySearch(rows, "lekki").length, 1);
  assert.equal(filterStockRemovalsBySearch(rows, "").length, 2);
});
