import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyDispositionToLine } from "./offboardPricing";
import type { DeviceLine } from "./offboardPricing";

const baseLine: DeviceLine = {
  id: "device-1",
  name: "MacBook Air",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 0,
};

describe("applyDispositionToLine", () => {
  it("keeps a wipe that is valid for the new disposition", () => {
    const line = applyDispositionToLine(
      { ...baseLine, wipeType: "Full Factory Reset" },
      "REASSIGN",
    );
    assert.equal(line.disposition, "REASSIGN");
    assert.equal(line.wipeType, "Full Factory Reset");
  });

  it("normalizes an invalid wipe to the disposition default", () => {
    const line = applyDispositionToLine(
      { ...baseLine, wipeType: "Full Factory Reset" },
      "DISPOSE",
    );
    assert.equal(line.disposition, "DISPOSE");
    assert.equal(line.wipeType, "Destruction Certificate");
  });

  it("clears the reassign target when leaving reassign", () => {
    const line = applyDispositionToLine(
      {
        ...baseLine,
        disposition: "REASSIGN",
        reassignTarget: { id: "emp-9", name: "Jane" },
      },
      "STORE",
    );
    assert.equal(line.disposition, "STORE");
    assert.equal(line.reassignTarget, undefined);
  });

  it("keeps the reassign target when staying on reassign", () => {
    const target = { id: "emp-9", name: "Jane" };
    const line = applyDispositionToLine(
      { ...baseLine, disposition: "REASSIGN", reassignTarget: target },
      "REASSIGN",
    );
    assert.deepEqual(line.reassignTarget, target);
  });
});
