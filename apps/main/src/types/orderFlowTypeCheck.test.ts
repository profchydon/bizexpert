import assert from "node:assert/strict";
import test from "node:test";
import { orderFlowTypeCheck } from "./offboarding";

test("storage_order has a Storage badge", () => {
  assert.equal(orderFlowTypeCheck.storage_order.label, "Storage");
  assert.equal(orderFlowTypeCheck.storage_order.variant, "gray_border");
});
