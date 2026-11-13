import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  toBulkCartItems,
  toDeployCartItem,
  toDeviceCheckCartItem,
  toDisposeCartItem,
} from "./queueStorageCartActions";
import type { StoredDevice } from "../types/storage";

const device = {
  id: "eq-1",
  deviceName: "Dell Dock",
  serialNumber: "022",
  country: "United Kingdom",
  assetType: "Dock",
} as StoredDevice;

describe("queueStorageCartActions", () => {
  it("keeps device-check reason and needed-by as separate cart fields", () => {
    const item = toDeviceCheckCartItem(
      device,
      "Pre-deployment check",
      "2026-08-19",
    );

    assert.equal(item.kind, "device_check");
    assert.equal(item.deviceId, "eq-1");
    assert.equal(item.checkReason, "Pre-deployment check");
    assert.equal(item.neededBy, "2026-08-19");
    assert.match(item.checkNote ?? "", /Pre-deployment check/);
  });

  it("does not attach check fields to disposal items", () => {
    const item = toDisposeCartItem(device, "destroy");
    assert.equal(item.kind, "disposal");
    assert.equal(item.checkReason, undefined);
    assert.equal(item.neededBy, undefined);
  });

  it("keeps the selected employee id on deploy cart items", () => {
    const item = toDeployCartItem(device, {
      id: "emp-9",
      name: "Ada Lovelace",
      email: "ada@example.com",
      country: "United Kingdom",
      address: "1 Computing Lane",
      phone: "",
    });

    assert.equal(item.kind, "deployment");
    assert.equal(item.employeeId, "emp-9");
    assert.equal(item.recipientName, "Ada Lovelace");

    const bulk = toBulkCartItems("deployment", [device], {
      "eq-1": { id: "emp-9", name: "Ada Lovelace", country: "United Kingdom" },
    });
    assert.equal(bulk[0]?.employeeId, "emp-9");
  });

  it("assigns unique cart item ids without Math.random", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Storage/Remote/utils/queueStorageCartActions.ts",
      ),
      "utf8",
    );
    assert.match(source, /crypto\.randomUUID\(\)/);
    assert.doesNotMatch(source, /Math\.random/);

    const first = toDeviceCheckCartItem(device, "Check");
    const second = toDeviceCheckCartItem(device, "Check");
    assert.notEqual(first.id, second.id);
    assert.match(first.id, /^chk-[0-9a-f-]{36}$/i);
  });

  it("waives disposal erasure from the device wipe status", () => {
    const wiped = toDisposeCartItem(
      { ...device, wipeStatus: "wiped" },
      "donate",
    );
    const dirty = toDisposeCartItem(
      { ...device, wipeStatus: "not_wiped" },
      "donate",
    );
    const bulk = toBulkCartItems("disposal", [
      { ...device, wipeStatus: "wiped" },
      { ...device, id: "eq-2", wipeStatus: "not_wiped" },
    ]);

    assert.equal(wiped.erasureWaived, true);
    assert.equal(dirty.erasureWaived, false);
    assert.equal(bulk[0]?.erasureWaived, true);
    assert.equal(bulk[1]?.erasureWaived, false);
  });
});
