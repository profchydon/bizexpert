import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { IInStorageInventoryItem } from "@/types/equipmentsInStorageInventory";
import { mapInStorageInventoryItem } from "./mapInStorageInventoryItem";

const sample: IInStorageInventoryItem = {
  id: "019f8bac-4110-70dc-82c8-84fe66b8e553",
  title: "Apple MacBook Pro M2",
  asset_type: "Laptop/Workstation",
  serial_number: "HKAJSH",
  image_url: null,
  country: {
    id: "88730c2b-90a9-47e3-bd11-03b1fc414d7d",
    name: "United States",
    code: "US",
  },
  entity: {
    id: "9de974c6-78c7-4ccc-ad7e-1a512dc832e8",
    name: "Intensa",
  },
  source: "buy_to_storage",
  source_label: "Buy to Storage",
  storage_status: "in_storage",
  storage_status_label: "In storage",
  needs_action: false,
  grade: {
    grade: "A",
    label: "Excellent",
    checked_at: null,
    checked_days_ago: null,
    synthetic: true,
  },
  wipe_status: null,
  entry_date: "2026-07-30",
  days_in_storage: 17,
  specs: {
    processor: "M2 Pro Chip",
    memory: "16GB Unified Memory",
  },
};

describe("mapInStorageInventoryItem", () => {
  it("maps API inventory rows into StoredDevice fields", () => {
    const mapped = mapInStorageInventoryItem(sample);

    assert.equal(mapped.deviceName, "Apple MacBook Pro M2");
    assert.equal(mapped.deviceType, "Laptop");
    assert.equal(mapped.assetType, "Laptop/Workstation");
    assert.equal(mapped.serialNumber, "HKAJSH");
    assert.equal(mapped.country, "United States");
    assert.equal(mapped.countryId, sample.country.id);
    assert.equal(mapped.countryCode, "US");
    assert.equal(mapped.entityName, "Intensa");
    assert.equal(mapped.entrySource, "buy_to_storage");
    assert.equal(mapped.sourceLabel, "Buy to Storage");
    assert.equal(mapped.status, "available");
    assert.equal(mapped.storageStatusLabel, "In storage");
    assert.equal(mapped.wipeStatus, undefined);
    assert.equal(mapped.grade, "A");
    assert.equal(mapped.gradeLabel, "Excellent");
    assert.equal(mapped.gradeSynthetic, true);
    assert.equal(mapped.daysInStorage, 17);
    assert.equal(mapped.needsActionFlag, false);
    assert.equal(mapped.availableActions, undefined);
    assert.equal(mapped.currency, "USD");
  });

  it("uses the workspace currency when provided", () => {
    const mapped = mapInStorageInventoryItem(sample, "GBP");
    assert.equal(mapped.currency, "GBP");
  });

  it("maps buy-to-storage available_actions including device check", () => {
    const mapped = mapInStorageInventoryItem({
      ...sample,
      available_actions: [
        "storage_device_check",
        "storage_disposal",
        "storage_deploy_to_employee",
      ],
    });
    assert.deepEqual(mapped.availableActions, [
      "deployment",
      "device_check",
      "disposal",
    ]);
  });

  it("omits device check for offboarding available_actions", () => {
    const mapped = mapInStorageInventoryItem({
      ...sample,
      source: "offboarding",
      source_label: "Offboarding",
      available_actions: ["storage_disposal", "storage_deploy_to_employee"],
      actions: [
        {
          type: "storage_device_check",
          label: "Device check",
          allowed: false,
          reason: "device_check_buy_to_storage_only",
          message:
            "Device checks can only be requested for buy-to-storage equipment.",
        },
        {
          type: "storage_disposal",
          label: "Request disposal",
          allowed: true,
          reason: null,
          message: null,
        },
        {
          type: "storage_deploy_to_employee",
          label: "Deploy to employee",
          allowed: true,
          reason: null,
          message: null,
        },
      ],
    });
    assert.deepEqual(mapped.availableActions, ["deployment", "disposal"]);
  });

  it("maps a completed check grade and API label", () => {
    const mapped = mapInStorageInventoryItem({
      ...sample,
      grade: {
        grade: "B",
        label: "Good",
        checked_at: "2026-08-12",
        checked_days_ago: 4,
        synthetic: false,
      },
    });
    assert.equal(mapped.grade, "B");
    assert.equal(mapped.gradeLabel, "Good");
    assert.equal(mapped.lastCheckDate, "2026-08-12");
    assert.equal(mapped.checkedDaysAgo, 4);
    assert.equal(mapped.gradeSynthetic, false);
  });

  it("falls back when serial number is missing", () => {
    const mapped = mapInStorageInventoryItem({
      ...sample,
      serial_number: null,
    });
    assert.equal(mapped.serialNumber, "—");
  });

  it("maps pending device check and completed wipe objects", () => {
    const mapped = mapInStorageInventoryItem({
      ...sample,
      asset_type: "Phones",
      storage_status: "pending_device_check",
      storage_status_label: "Pending Device Check",
      wipe_status: {
        required: true,
        status: "completed",
        label: "Completed",
      },
    });

    assert.equal(mapped.deviceType, "Smartphone");
    assert.equal(mapped.status, "pending_check");
    assert.equal(mapped.storageStatusLabel, "Pending Device Check");
    assert.equal(mapped.wipeStatus, "wiped");
    assert.equal(mapped.wipeLabel, "Completed");
    assert.equal(mapped.sourceLabel, "Buy to Storage");
  });
});
