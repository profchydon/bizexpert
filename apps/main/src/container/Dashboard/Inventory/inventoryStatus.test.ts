import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatMovementType,
  formatStocktakeStatus,
  formatTransferStatus,
  isInTransitTransfer,
  isOpenStocktake,
  isPendingStocktake,
  toQuantityNumber,
} from "./inventoryStatus";

test("status helpers match API enums", () => {
  assert.equal(formatTransferStatus("in_transit"), "In transit");
  assert.equal(formatStocktakeStatus("pending_approval"), "Pending approval");
  assert.equal(formatStocktakeStatus("applied"), "Applied");
  assert.equal(formatMovementType("opening_stock"), "opening stock");
  assert.equal(isInTransitTransfer("in_transit"), true);
  assert.equal(isOpenStocktake("counting"), true);
  assert.equal(isPendingStocktake("pending_approval"), true);
});

test("toQuantityNumber reads prisma decimal strings", () => {
  assert.equal(toQuantityNumber("12.5000"), 12.5);
  assert.equal(toQuantityNumber(null), 0);
});
