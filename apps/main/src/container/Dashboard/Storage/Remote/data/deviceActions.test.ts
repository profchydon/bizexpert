import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { StoredDevice } from "../types/storage";
import {
  availableActions,
  canOfferDeviceCheck,
  canQueueDeviceCheck,
  devicesForBulkAction,
  mergeDeviceActions,
} from "./deviceActions";

const available: StoredDevice = {
  id: "eq-1",
  deviceName: "Apple Macbook Air M3",
  model: "MacBook Air",
  deviceType: "Laptop",
  assetType: "Laptop/Workstation",
  serialNumber: "—",
  country: "United Kingdom",
  warehouse: "Balo Gun Biz",
  entrySource: "buy_to_storage",
  entryDate: "2026-09-11",
  status: "available",
  currency: "USD",
};

const pending: StoredDevice = { ...available, status: "pending_check" };

describe("deviceActions", () => {
  it("falls back to status when the API did not send available actions", () => {
    assert.deepEqual(availableActions(available), [
      "deployment",
      "device_check",
      "disposal",
    ]);
    assert.deepEqual(availableActions(pending), []);
    assert.equal(canOfferDeviceCheck(available), true);
    assert.equal(canOfferDeviceCheck(pending), false);
  });

  it("uses the inventory available_actions list when present", () => {
    const offboarding = {
      ...available,
      entrySource: "offboarding" as const,
      availableActions: ["deployment", "disposal"] as const,
    };
    assert.deepEqual(availableActions(offboarding), ["deployment", "disposal"]);
    assert.equal(canOfferDeviceCheck(offboarding), false);
    assert.deepEqual(
      availableActions({ ...available, availableActions: [] }),
      [],
    );
  });

  it("blocks queueing a check while one is already in progress", () => {
    assert.equal(canQueueDeviceCheck(available, false), true);
    assert.equal(canQueueDeviceCheck(available, true), false);
    assert.equal(canQueueDeviceCheck(pending, false), false);
    assert.equal(canQueueDeviceCheck(pending, true), false);
    assert.equal(
      canQueueDeviceCheck(
        { ...available, availableActions: ["disposal"] },
        false,
      ),
      false,
    );
  });

  it("keeps only devices that allow the bulk action", () => {
    const check = { ...available, id: "bts" };
    const noCheck = {
      ...available,
      id: "off",
      availableActions: [
        "deployment",
        "disposal",
      ] as StoredDevice["availableActions"],
    };
    assert.deepEqual(
      devicesForBulkAction([check, noCheck], "device_check").map((d) => d.id),
      ["bts"],
    );
  });

  it("keeps list available_actions when detail omits them", () => {
    const listed = {
      ...available,
      availableActions: [
        "deployment",
        "disposal",
      ] as StoredDevice["availableActions"],
    };
    const detailed = { ...available, warehouse: "United Kingdom" };
    assert.deepEqual(mergeDeviceActions(listed, detailed).availableActions, [
      "deployment",
      "disposal",
    ]);
    assert.deepEqual(
      mergeDeviceActions(listed, {
        ...detailed,
        availableActions: ["disposal"],
      }).availableActions,
      ["disposal"],
    );
  });
});
