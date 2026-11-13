import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  displayImportEquipmentValue,
  formatImportAssetTypeYear,
  formatImportMakeModel,
  IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER,
} from "./importEquipmentPreviewFormat.ts";

describe("importEquipmentPreviewFormat", () => {
  it("joins make and model on one line", () => {
    assert.equal(
      formatImportMakeModel("HP", "EliteDisplay"),
      "HP EliteDisplay",
    );
    assert.equal(formatImportMakeModel("HP", ""), "HP");
    assert.equal(
      formatImportMakeModel("", ""),
      IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER,
    );
  });

  it("joins asset type and year on one line", () => {
    assert.equal(formatImportAssetTypeYear("Tablet", "2021"), "Tablet 2021");
    assert.equal(formatImportAssetTypeYear("Phones", 2020), "Phones 2020");
    assert.equal(
      formatImportAssetTypeYear("", ""),
      IMPORT_EQUIPMENT_PREVIEW_PLACEHOLDER,
    );
  });

  it("formats numeric import values without throwing", () => {
    assert.equal(displayImportEquipmentValue(2021), "2021");
    assert.equal(formatImportMakeModel("HP", 2024), "HP 2024");
  });
});
