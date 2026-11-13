import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canPerformAction } from "./util.ts";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";

describe("canPerformAction", () => {
  it("matches the pre-UI-update lifecycle rules", () => {
    assert.equal(canPerformAction("assigned", "transfer"), true);
    assert.equal(canPerformAction("unassigned", "transfer"), true);
    assert.equal(canPerformAction("Unassigned", "transfer"), false);
    assert.equal(canPerformAction("assigned", "store"), true);
    assert.equal(
      canPerformAction(UNASSIGNED_ORDER_SUMMARY_KEY, "store"),
      false,
    );
    assert.equal(canPerformAction("unassigned", "store"), false);
    assert.equal(canPerformAction("in_storage", "transfer"), false);
    assert.equal(canPerformAction("assigned", "dispose"), true);
    assert.equal(canPerformAction("unassigned", "dispose"), false);
    assert.equal(canPerformAction("in_storage", "sell"), true);
  });
});
