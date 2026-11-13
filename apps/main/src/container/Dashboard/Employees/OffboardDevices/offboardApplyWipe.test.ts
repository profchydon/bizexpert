import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { applyWipeToLine } from "./offboardPricing";
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

describe("applyWipeToLine", () => {
  it("applies a wipe that is valid for the disposition", () => {
    const line = applyWipeToLine(baseLine, "Full Factory Reset");
    assert.equal(line.wipeType, "Full Factory Reset");
  });

  it("leaves the line unchanged when the wipe is not allowed", () => {
    const line = applyWipeToLine(baseLine, "Destruction Certificate");
    assert.equal(line.wipeType, "None");
    assert.equal(line, baseLine);
  });

  it("applies the only valid wipe for Dispose", () => {
    const line = applyWipeToLine(
      {
        ...baseLine,
        disposition: "DISPOSE",
        wipeType: "Destruction Certificate",
      },
      "Destruction Certificate",
    );
    assert.equal(line.wipeType, "Destruction Certificate");
  });

  it("ignores an unsupported wipe for Dispose", () => {
    const disposeLine: DeviceLine = {
      ...baseLine,
      disposition: "DISPOSE",
      wipeType: "Destruction Certificate",
    };
    const line = applyWipeToLine(disposeLine, "None");
    assert.equal(line.wipeType, "Destruction Certificate");
  });
});
