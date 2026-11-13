import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getDispositionDeviceIds,
  getSelectedDeviceIds,
  getSelectedRowCount,
  isDispositionEquipment,
  isSelectableEquipment,
} from "./employeeEquipmentSelection";

describe("employeeEquipmentSelection", () => {
  it("treats any row with an id as selectable", () => {
    assert.equal(
      isSelectableEquipment({ id: "1", status: "in_storage", title: "Laptop" }),
      true,
    );
    assert.equal(isSelectableEquipment({ title: "Laptop" }), false);
  });

  it("only treats assigned equipment as disposition-eligible", () => {
    assert.equal(
      isDispositionEquipment({ id: "1", status: "assigned", title: "Laptop" }),
      true,
    );
    assert.equal(
      isDispositionEquipment({
        id: "2",
        status: "in_storage",
        title: "Laptop",
      }),
      false,
    );
  });

  it("counts only disposition-eligible rows for the bulk bar", () => {
    const rows = [
      { id: "1", status: "assigned", title: "A" },
      { id: "2", status: "in_storage", title: "B" },
    ];

    assert.equal(getSelectedRowCount(new Set(["1", "2"]), rows as any), 1);
  });

  it("returns every selected device id for bulk disposition handoff", () => {
    const rows = [
      { id: "1", status: "assigned", title: "A" },
      { id: "2", status: "in_storage", title: "B" },
    ];

    assert.deepEqual(getSelectedDeviceIds(rows as any, new Set(["1", "2"])), [
      "1",
      "2",
    ]);
  });

  it("filters disposition ids down to assigned equipment", () => {
    const rows = [
      { id: "1", status: "assigned", title: "A" },
      { id: "2", status: "in_storage", title: "B" },
    ];

    assert.deepEqual(
      getDispositionDeviceIds(rows as any, new Set(["1", "2"])),
      ["1"],
    );
  });
});
