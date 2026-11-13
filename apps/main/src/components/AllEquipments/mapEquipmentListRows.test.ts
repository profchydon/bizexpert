import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapEquipmentListRows } from "./mapEquipmentListRows";

describe("mapEquipmentListRows", () => {
  it("replaces missing assignee with the unassigned placeholder", () => {
    const rows = mapEquipmentListRows([
      { id: "1", assignee: null } as any,
      { id: "2", assignee: { id: "a-1", name: "Ada" } } as any,
    ]);

    assert.deepEqual(rows[0].assignee, {
      id: "Unassigned",
      name: "Unassigned",
    });
    assert.deepEqual(rows[1].assignee, { id: "a-1", name: "Ada" });
  });

  it("returns an empty array when rows are missing", () => {
    assert.deepEqual(mapEquipmentListRows(undefined), []);
  });
});
