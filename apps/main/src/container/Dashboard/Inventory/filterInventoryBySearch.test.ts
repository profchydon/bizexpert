import assert from "node:assert/strict";
import { test } from "node:test";
import type { InventoryBalance, StockTransfer } from "@/types/bizexpert";
import {
  filterBalancesBySearch,
  filterTransfersBySearch,
} from "./filterInventoryBySearch";

test("filterBalancesBySearch matches product or location name", () => {
  const rows: InventoryBalance[] = [
    {
      id: "1",
      productId: "p1",
      locationId: "l1",
      quantity: 2,
      averageCost: 1,
      totalValue: 2,
      product: {
        id: "p1",
        businessId: "b",
        name: "Rice",
        sellingPrice: 1,
        purchaseCost: 1,
        baseUnit: "bag",
        lowStockThreshold: 1,
        isActive: true,
      },
      location: {
        id: "l1",
        businessId: "b",
        name: "Main shop",
        type: "shop",
        isDefault: true,
        isActive: true,
      },
    },
  ];
  assert.equal(filterBalancesBySearch(rows, "rice").length, 1);
  assert.equal(filterBalancesBySearch(rows, "shop").length, 1);
  assert.equal(filterBalancesBySearch(rows, "warehouse").length, 0);
});

test("filterTransfersBySearch matches transfer number", () => {
  const rows: StockTransfer[] = [
    {
      id: "t1",
      transferNumber: "TRF-20261030-0001",
      status: "in_transit",
      createdAt: "2026-10-30T00:00:00.000Z",
    },
  ];
  assert.equal(filterTransfersBySearch(rows, "trf-2026").length, 1);
  assert.equal(filterTransfersBySearch(rows, "missing").length, 0);
});
