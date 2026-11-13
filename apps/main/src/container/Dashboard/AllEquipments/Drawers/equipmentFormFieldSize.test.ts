import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const DRAWERS = "src/container/Dashboard/AllEquipments/Drawers";
const ADD = `${DRAWERS}/AddEquipment`;

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("equipment form field size", () => {
  it("uses md on every input, select, and combobox in a paired row", () => {
    const core = read(`${DRAWERS}/SingleEquipmentEditCoreFields.tsx`);
    const country = read(`${DRAWERS}/SingleEquipmentCountryField.tsx`);
    const extra = read(`${ADD}/SingleEquipmentAddExtraFields.tsx`);
    const office = read(`${ADD}/SingleEquipmentAddOfficeField.tsx`);
    const price = read(`${ADD}/SingleEquipmentAddPriceFields.tsx`);
    const importedPrice = read(
      `${ADD}/ImportEquipments/EditImportedEquipment/EditImportedEquipmentPriceFields.tsx`,
    );

    assert.equal([...core.matchAll(/size="md"/g)].length, 8);
    assert.match(core, /label="Asset type"\s+size="md"/);
    assert.match(core, /label="Asset state"\s+size="md"/);
    assert.match(country, /label="Select Country"\s+size="md"/);
    assert.match(extra, /label="Asset status"\s+size="md"/);
    assert.match(extra, /label="Select assignee"\s+size="md"/);
    assert.match(office, /label="Assign to office"\s+size="md"/);
    assert.match(price, /size="md"/);
    assert.match(importedPrice, /label="Currency"\s+size="md"/);
  });
});
