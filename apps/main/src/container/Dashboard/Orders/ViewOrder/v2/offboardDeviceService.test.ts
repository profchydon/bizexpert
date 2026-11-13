import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getOffboardDeviceService } from "./offboardDeviceService";

describe("getOffboardDeviceService", () => {
  it("labels storage as Store and includes a device check", () => {
    const service = getOffboardDeviceService("storage");
    assert.equal(service.dispositionLabel, "Store");
    assert.equal(service.deviceCheckIncluded, true);
  });

  it("labels reassign as Reassign", () => {
    assert.equal(
      getOffboardDeviceService("reassign").dispositionLabel,
      "Reassign",
    );
  });

  it("labels dispose as Dispose without a device check", () => {
    const service = getOffboardDeviceService("dispose");
    assert.equal(service.dispositionLabel, "Dispose");
    assert.equal(service.deviceCheckIncluded, false);
  });

  it("defaults unknown types to Store", () => {
    assert.equal(getOffboardDeviceService(undefined).dispositionLabel, "Store");
  });
});
