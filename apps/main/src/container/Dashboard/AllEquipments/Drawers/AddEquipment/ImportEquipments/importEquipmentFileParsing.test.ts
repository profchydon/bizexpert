import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { filterImportedEquipmentItems } from "./importEquipmentFileParsing.ts";

describe("filterImportedEquipmentItems", () => {
  it("removes duplicate serial numbers and keeps unique rows", () => {
    const rows = filterImportedEquipmentItems([
      { title: "Mac", serial_number: "SN-1" } as never,
      { title: "Mac 2", serial_number: "SN-1" } as never,
      { title: "Dell", serial_number: "SN-2" } as never,
    ]);

    assert.equal(rows.length, 2);
    assert.equal(rows[0]?.serial_number, "SN-1");
    assert.equal(rows[1]?.serial_number, "SN-2");
  });
});
