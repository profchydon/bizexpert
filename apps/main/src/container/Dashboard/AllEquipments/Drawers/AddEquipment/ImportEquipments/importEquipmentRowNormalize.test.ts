import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatImportAssetSerial,
  IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER,
  isImportPreviewUuid,
} from "./importEquipmentPreviewFormat.ts";
import {
  assignImportedEquipmentRowId,
  normalizeImportedEquipmentRow,
  sanitizeImportedEquipmentSerial,
} from "./importEquipmentRowNormalize.ts";

describe("importEquipmentRowNormalize", () => {
  it("replaces template UUID ids with stable numeric row ids", () => {
    const row = normalizeImportedEquipmentRow(
      {
        id: "ee6e6072-f3f3-4a70-96af-346d36657956",
        title: "HP EliteDisplay",
        serial_number: "ee6e6072-f3f3-4a70-96af-346d36657956",
      } as never,
      0,
    );

    assert.equal(row.id, 1);
    assert.equal(row.serial_number, "");
  });

  it("keeps real serial numbers and numeric ids from the template", () => {
    assert.equal(
      sanitizeImportedEquipmentSerial("Z6A7B8C9D0", "1"),
      "Z6A7B8C9D0",
    );
    assert.equal(assignImportedEquipmentRowId("12", 0), 12);
    assert.equal(isImportPreviewUuid("Z6A7B8C9D0"), false);
  });

  it("hides UUID-like serial values in preview output", () => {
    assert.equal(
      formatImportAssetSerial(
        "ee6e6072-f3f3-4a70-96af-346d36657956",
        "ee6e6072-f3f3-4a70-96af-346d36657956",
      ),
      IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER,
    );
    assert.equal(formatImportAssetSerial("SN-123", "1"), "SN-123");
  });
});
