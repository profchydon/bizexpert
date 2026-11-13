import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildStorageCartNotification } from "./buildStorageCartNotification";

describe("buildStorageCartNotification", () => {
  it("describes the queued action kind", () => {
    const message = buildStorageCartNotification([
      {
        id: "1",
        kind: "deployment",
        deviceId: "dev-1",
        deviceName: "MacBook Pro",
        serialNumber: "SN-1",
        country: "United States",
        assetType: "Laptop/Workstation",
      },
    ]);

    assert.equal(message?.title, "Added to cart");
    assert.match(message?.description ?? "", /Deploy to employee/);
  });
});
