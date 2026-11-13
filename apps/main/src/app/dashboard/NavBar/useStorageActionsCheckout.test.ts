import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STORAGE_ACTIONS_FLOW,
  storageActionsOrderSummaryPath,
} from "./useStorageActionsCheckout";

describe("storageActionsOrderSummaryPath", () => {
  it("routes storage cart checkout to equip-employee order summary", () => {
    assert.equal(
      storageActionsOrderSummaryPath(),
      `/dashboard/equip-employee/order-summary?flow=${STORAGE_ACTIONS_FLOW}`,
    );
  });
});
