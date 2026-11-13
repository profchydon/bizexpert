import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapAssetTypeToDeviceType,
  mapStorageStatus,
  mapWipeStatus,
} from "./inStorageInventoryMaps";

describe("mapStorageStatus", () => {
  it("maps in-storage keys and labels to available", () => {
    assert.equal(mapStorageStatus("in_storage"), "available");
    assert.equal(mapStorageStatus("In storage"), "available");
    assert.equal(mapStorageStatus({ status: "in_storage" }), "available");
  });

  it("maps pending-check keys and labels", () => {
    assert.equal(mapStorageStatus("pending_device_check"), "pending_check");
    assert.equal(mapStorageStatus("pending_check"), "pending_check");
    assert.equal(
      mapStorageStatus("in_storage", "Pending Device Check"),
      "available",
    );
    assert.equal(
      mapStorageStatus("unknown_status", "Pending Device Check"),
      "pending_check",
    );
  });
});

describe("mapWipeStatus", () => {
  it("maps completed wipe objects from the inventory API", () => {
    assert.equal(
      mapWipeStatus({
        required: true,
        status: "completed",
        label: "Completed",
      }),
      "wiped",
    );
  });

  it("omits wipe when the API says it is not required", () => {
    assert.equal(
      mapWipeStatus({
        required: false,
        status: null,
        label: "Not required",
      }),
      undefined,
    );
    assert.equal(mapWipeStatus("Not required"), undefined);
    assert.equal(mapWipeStatus(null), undefined);
  });

  it("maps string wipe values", () => {
    assert.equal(mapWipeStatus("wiped"), "wiped");
    assert.equal(mapWipeStatus("completed"), "wiped");
    assert.equal(mapWipeStatus("not_wiped"), "not_wiped");
    assert.equal(mapWipeStatus("new"), "new");
  });
});

describe("mapAssetTypeToDeviceType", () => {
  it("maps live inventory asset types onto the storage taxonomy", () => {
    assert.equal(mapAssetTypeToDeviceType("Laptop/Workstation"), "Laptop");
    assert.equal(mapAssetTypeToDeviceType("Phones"), "Smartphone");
    assert.equal(mapAssetTypeToDeviceType("Monitor"), "Display");
    assert.equal(mapAssetTypeToDeviceType("Tablet"), "Tablet");
  });
});
