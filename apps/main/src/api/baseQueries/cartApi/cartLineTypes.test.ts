import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cartLineType, isStorageCartLine } from "./cartLineTypes";

describe("cartLineTypes", () => {
  it("classifies storage action types and marketplace fallbacks", () => {
    assert.equal(
      cartLineType({ type: "storage_device_check" }),
      "storage_device_check",
    );
    assert.equal(
      cartLineType({ type: "storage_disposal" }),
      "storage_disposal",
    );
    assert.equal(
      cartLineType({ type: "storage_deploy_to_employee" }),
      "storage_deploy_to_employee",
    );
    assert.equal(cartLineType({ type: "marketplace" }), "marketplace");
    assert.equal(cartLineType({}), "marketplace");
    assert.equal(cartLineType(null), "marketplace");
  });

  it("narrows storage cart lines away from marketplace", () => {
    assert.equal(isStorageCartLine({ type: "storage_disposal" }), true);
    assert.equal(isStorageCartLine({ type: "marketplace" }), false);
  });
});
