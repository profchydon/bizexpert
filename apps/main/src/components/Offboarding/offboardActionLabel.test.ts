import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getOffboardActionLabel } from "./util";

describe("getOffboardActionLabel", () => {
  it("shows Dispose for archived devices in employee off-boarding", () => {
    assert.equal(getOffboardActionLabel("Archive", true), "Dispose");
  });

  it("keeps Archive outside employee off-boarding", () => {
    assert.equal(getOffboardActionLabel("Archive", false), "Archive");
  });

  it("leaves other action labels unchanged", () => {
    assert.equal(getOffboardActionLabel("Store", true), "Store");
    assert.equal(getOffboardActionLabel("Transfer", true), "Reassign");
    assert.equal(getOffboardActionLabel("Sale", true), "Sale");
  });
});
