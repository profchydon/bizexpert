import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StoredDevice } from "../types/storage";
import { checkFreshnessLabel } from "./deriveDevice";

const device: StoredDevice = {
  id: "eq-1",
  deviceName: "MacBook",
  model: "MacBook",
  deviceType: "Laptop",
  assetType: "Laptop/Workstation",
  serialNumber: "SN-1",
  country: "Nigeria",
  warehouse: "Nigeria",
  entrySource: "buy_to_storage",
  entryDate: "2026-09-15",
  status: "available",
  currency: "USD",
};

describe("checkFreshnessLabel", () => {
  it("does not invent copy when the API has no check date", () => {
    assert.equal(checkFreshnessLabel(device), null);
  });

  it("uses checked_days_ago from the inventory payload", () => {
    assert.equal(
      checkFreshnessLabel({ ...device, checkedDaysAgo: 12 }),
      "Checked 12d ago",
    );
  });

  it("hides checked-ago copy while a device check is still pending", () => {
    assert.equal(
      checkFreshnessLabel({
        ...device,
        status: "pending_check",
        checkedDaysAgo: 0,
      }),
      null,
    );
  });
});
