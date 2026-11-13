import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isUsableEquipmentId,
  resolveReassignEquipmentIds,
  resolveSystemReassignEquipId,
} from "./resolveReassignEquipmentIds";

describe("isUsableEquipmentId", () => {
  it("accepts a real equipment id", () => {
    assert.equal(
      isUsableEquipmentId("01a0b0b4-b45c-7292-a728-0d5ee6b0ad86"),
      true,
    );
  });

  it("rejects missing and placeholder values", () => {
    assert.equal(isUsableEquipmentId(null), false);
    assert.equal(isUsableEquipmentId(undefined), false);
    assert.equal(isUsableEquipmentId("null"), false);
    assert.equal(isUsableEquipmentId("undefined"), false);
    assert.equal(isUsableEquipmentId(""), false);
  });
});

describe("resolveReassignEquipmentIds", () => {
  it("prefers selected row ids over a missing URL id", () => {
    assert.deepEqual(
      resolveReassignEquipmentIds({
        equipID: null,
        selectedRows: [{ id: "equip-1" }, { id: "equip-2" }],
      }),
      ["equip-1", "equip-2"],
    );
  });

  it("ignores null selected ids and falls back to the URL id", () => {
    assert.deepEqual(
      resolveReassignEquipmentIds({
        equipID: "equip-from-url",
        selectedRows: [{ id: null }, { id: "undefined" }],
      }),
      ["equip-from-url"],
    );
  });

  it("uses single equipment data when nothing else is usable", () => {
    assert.deepEqual(
      resolveReassignEquipmentIds({
        equipID: "null",
        selectedRows: [],
        singleEquipmentData: { id: "equip-detail" },
      }),
      ["equip-detail"],
    );
  });

  it("returns an empty list when every source is missing", () => {
    assert.deepEqual(
      resolveReassignEquipmentIds({
        equipID: null,
        selectedRows: [{ id: null }],
      }),
      [],
    );
  });
});

describe("resolveSystemReassignEquipId", () => {
  it("uses the first selected row when the header reassign has no item", () => {
    assert.equal(
      resolveSystemReassignEquipId([{ id: "row-1" }, { id: "row-2" }]),
      "row-1",
    );
  });

  it("uses the row-action item when nothing is selected", () => {
    assert.equal(resolveSystemReassignEquipId([], { id: "item-1" }), "item-1");
  });
});
