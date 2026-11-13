import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isDeviceAlreadyErased } from "./isDeviceAlreadyErased";

describe("isDeviceAlreadyErased", () => {
  it("waives erasure only when wipe_status is wiped", () => {
    assert.equal(isDeviceAlreadyErased({ wipeStatus: "wiped" }), true);
    assert.equal(isDeviceAlreadyErased({ wipeStatus: "not_wiped" }), false);
    assert.equal(isDeviceAlreadyErased({ wipeStatus: "new" }), false);
    assert.equal(isDeviceAlreadyErased({}), false);
  });
});
