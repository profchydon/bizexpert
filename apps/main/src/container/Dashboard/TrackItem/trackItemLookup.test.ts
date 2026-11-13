import assert from "node:assert/strict";
import { test } from "node:test";
import type { InventoryBalance, Product } from "@/types/bizexpert";
import {
  filterBalancesForProduct,
  isMissingBarcodeLookup,
  lookupErrorStatus,
  mergeTrackItemMatches,
  productCodeLabel,
  storesWithStock,
  totalBalanceQuantity,
  totalBalanceValue,
} from "./trackItemLookup";

const phone: Product = {
  id: "p1",
  businessId: "b1",
  name: "Pixel",
  sku: "PX-1",
  barcode: "8901",
  sellingPrice: 100,
  purchaseCost: 70,
  baseUnit: "piece",
  lowStockThreshold: 2,
  isActive: true,
};

const caseItem: Product = {
  ...phone,
  id: "p2",
  name: "Case",
  sku: "CS-1",
  barcode: undefined,
};

test("merge prefers the barcode hit and drops duplicate search rows", () => {
  const merged = mergeTrackItemMatches(phone, [phone, caseItem]);
  assert.deepEqual(
    merged.map((row) => row.id),
    ["p1", "p2"],
  );
});

test("merge returns search hits when barcode lookup missed", () => {
  assert.deepEqual(mergeTrackItemMatches(null, [caseItem]), [caseItem]);
  assert.deepEqual(mergeTrackItemMatches(null, []), []);
});

test("missing barcode lookup treats 404 and 400 as empty", () => {
  assert.equal(isMissingBarcodeLookup(404), true);
  assert.equal(isMissingBarcodeLookup(400), true);
  assert.equal(isMissingBarcodeLookup(500), false);
  assert.equal(lookupErrorStatus({ response: { status: 404 } }), 404);
  assert.equal(lookupErrorStatus("nope"), undefined);
});

test("stock helpers filter and sum balances for one product", () => {
  const rows = [
    {
      id: "a",
      productId: "p1",
      locationId: "l1",
      quantity: "3.00",
      averageCost: 10,
      totalValue: "30.00",
    },
    {
      id: "b",
      productId: "p2",
      locationId: "l1",
      quantity: 9,
      averageCost: 1,
      totalValue: 9,
    },
    {
      id: "c",
      productId: "p1",
      locationId: "l2",
      quantity: 0,
      averageCost: 10,
      totalValue: 0,
    },
  ] as InventoryBalance[];
  const stock = filterBalancesForProduct(rows, "p1");
  assert.equal(stock.length, 2);
  assert.equal(totalBalanceQuantity(stock), 3);
  assert.equal(storesWithStock(stock), 1);
  assert.equal(totalBalanceValue(stock), 30);
});

test("product code label prefers sku then barcode", () => {
  assert.equal(productCodeLabel(phone), "PX-1");
  assert.equal(productCodeLabel({ ...phone, sku: undefined }), "8901");
  assert.equal(
    productCodeLabel({ ...phone, sku: undefined, barcode: undefined }),
    "—",
  );
});
