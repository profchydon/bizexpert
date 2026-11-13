import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildDeviceLines,
  calculateServiceFeesTotal,
  formatServiceFee,
  hasMissingReassignTarget,
  isReassignIncomplete,
  DEFAULT_DISPOSITION,
  DEFAULT_WIPE_TYPE,
  type DeviceLine,
} from "./offboardPricing";
import type { IEquipment } from "@/types/equipments";

const line = (overrides: Partial<DeviceLine>): DeviceLine => ({
  id: "l-1",
  name: "Device",
  serial: "SN-1",
  imageUrl: null,
  disposition: "STORE",
  wipeType: "None",
  fee: 105,
  ...overrides,
});

const equipment = (overrides: Partial<IEquipment>): IEquipment =>
  ({
    id: "eq-1",
    title: "Dell XPS 13",
    serial_number: "SN-1D",
    image_url: "https://img/device.png",
    status: "assigned",
    ...overrides,
  }) as IEquipment;

describe("buildDeviceLines", () => {
  it("returns an empty array when equipment is missing", () => {
    assert.deepEqual(buildDeviceLines(undefined), []);
    assert.deepEqual(buildDeviceLines(null), []);
  });

  it("maps equipment to lines with defaults and a zero fee", () => {
    const [line] = buildDeviceLines([equipment({})]);

    assert.equal(line.id, "eq-1-0");
    assert.equal(line.equipmentId, "eq-1");
    assert.equal(line.name, "Dell XPS 13");
    assert.equal(line.serial, "SN-1D");
    assert.equal(line.imageUrl, "https://img/device.png");
    assert.equal(line.disposition, DEFAULT_DISPOSITION);
    assert.equal(line.wipeType, DEFAULT_WIPE_TYPE);
    assert.equal(line.fee, 0);
    assert.equal(line.assetType, undefined);
  });

  it("copies the equipment type for Storage fee lookup", () => {
    const [line] = buildDeviceLines([equipment({ type: "Macbook" })]);

    assert.equal(line.assetType, "Macbook");
  });

  it("falls back gracefully for missing fields", () => {
    const [line] = buildDeviceLines([
      equipment({ id: undefined, title: "", serial_number: "", image_url: "" }),
    ]);

    assert.equal(line.id, "device-0");
    assert.equal(line.equipmentId, "");
    assert.equal(line.name, "Device");
    assert.equal(line.serial, "—");
    assert.equal(line.imageUrl, null);
  });

  it("only includes assigned devices", () => {
    const lines = buildDeviceLines([
      equipment({ id: "a", status: "assigned" }),
      equipment({ id: "b", status: "pending_pickup" }),
      equipment({ id: "c", status: "request_storage" }),
      equipment({ id: "d", status: "Assigned" }),
    ]);

    assert.deepEqual(
      lines.map((line) => line.id),
      ["a-0", "d-1"],
    );
  });

  it("gives duplicate equipment ids unique line ids", () => {
    const lines = buildDeviceLines([
      equipment({ id: "dup" }),
      equipment({ id: "dup" }),
    ]);

    assert.deepEqual(
      lines.map((deviceLine) => deviceLine.id),
      ["dup-0", "dup-1"],
    );
    assert.deepEqual(
      lines.map((deviceLine) => deviceLine.equipmentId),
      ["dup", "dup"],
    );
  });
});

describe("calculateServiceFeesTotal", () => {
  it("sums line fees after the server stamps them", () => {
    const lines = [
      line({ fee: 30 }),
      line({ id: "l-2", fee: 25 }),
      line({ id: "l-3", fee: 30 }),
    ];

    assert.equal(calculateServiceFeesTotal(lines), 85);
  });

  it("returns 0 for no lines", () => {
    assert.equal(calculateServiceFeesTotal([]), 0);
  });
});

describe("formatServiceFee", () => {
  it("formats with a dollar sign and thousands separator", () => {
    assert.equal(formatServiceFee(105), "$105");
    assert.equal(formatServiceFee(1420), "$1,420");
  });
});

describe("isReassignIncomplete", () => {
  it("is true only for reassign lines without a target", () => {
    assert.equal(isReassignIncomplete(line({ disposition: "REASSIGN" })), true);
    assert.equal(
      isReassignIncomplete(
        line({
          disposition: "REASSIGN",
          reassignTarget: { id: "x", name: "Jane" },
        }),
      ),
      false,
    );
    assert.equal(isReassignIncomplete(line({ disposition: "STORE" })), false);
  });
});

describe("hasMissingReassignTarget", () => {
  it("is false when no reassign line is missing a target", () => {
    assert.equal(
      hasMissingReassignTarget({
        a: [line({ disposition: "STORE" })],
        b: [
          line({
            disposition: "REASSIGN",
            reassignTarget: { id: "x", name: "Jane" },
          }),
        ],
      }),
      false,
    );
  });

  it("is true when any reassign line across employees lacks a target", () => {
    assert.equal(
      hasMissingReassignTarget({
        a: [line({ disposition: "STORE" })],
        b: [line({ id: "l-2", disposition: "REASSIGN" })],
      }),
      true,
    );
  });
});
