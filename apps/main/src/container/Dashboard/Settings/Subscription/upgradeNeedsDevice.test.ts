import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UPGRADE_NEEDS_DEVICE } from "./featureHints";
import {
  deviceCountForUpgrade,
  upgradeBlockedWithoutDevices,
} from "./subscriptionView";

describe("upgrade without devices", () => {
  it("blocks an upgrade when no device has been added", () => {
    assert.equal(upgradeBlockedWithoutDevices("upgrade", 0), true);
    assert.match(UPGRADE_NEEDS_DEVICE, /Add a device/);
  });

  it("allows an upgrade once a device exists", () => {
    assert.equal(upgradeBlockedWithoutDevices("upgrade", 2), false);
  });

  it("counts fleet equipment when the plan quote has no device count", () => {
    const devices = deviceCountForUpgrade(0, 1);
    assert.equal(devices, 1);
    assert.equal(upgradeBlockedWithoutDevices("upgrade", devices), false);
  });

  it("keeps the quote count until the equipment total is known", () => {
    assert.equal(deviceCountForUpgrade(338), 338);
    assert.equal(deviceCountForUpgrade(0, 0), 0);
  });

  it("leaves a downgrade available with an empty fleet", () => {
    assert.equal(upgradeBlockedWithoutDevices("downgrade", 0), false);
    assert.equal(upgradeBlockedWithoutDevices("current", 0), false);
  });
});
