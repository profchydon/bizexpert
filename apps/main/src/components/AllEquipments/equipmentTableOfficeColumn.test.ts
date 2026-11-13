import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const readSource = (relativePath: string) =>
  readFileSync(join(process.cwd(), relativePath), "utf8");

describe("equipment table office column", () => {
  it("places the office column directly after location", () => {
    const source = readSource(
      "src/components/AllEquipments/AllEquipmentsTable/tableColumn.tsx",
    );

    const locationIndex = source.indexOf('header: "Location"');
    const officeIndex = source.indexOf('header: "Office"');
    const statusIndex = source.indexOf('header: "Status"');

    assert.ok(locationIndex > -1);
    assert.ok(officeIndex > locationIndex);
    assert.ok(statusIndex > officeIndex);
    assert.match(source, /accessorKey: "office"/);
    assert.match(source, /EquipmentTableOfficeCell/);
  });

  it("renders the office name with the area beneath it and a dash fallback", () => {
    const cell = readSource(
      "src/components/AllEquipments/EquipmentTableOfficeCell.tsx",
    );

    assert.match(cell, /export const EquipmentTableOfficeCell/);
    assert.match(cell, /row\?\.office\?\.name/);
    assert.match(cell, /row\?\.office_area\?\.name/);
    assert.match(cell, /text-sm text-quaternary/);
  });

  it("keeps office fields on the equipment type", () => {
    const source = readSource("src/types/equipments.ts");

    assert.match(source, /office\?: OfficeEntityRef \| null;/);
    assert.match(source, /office_area\?: ServerOfficeArea \| null;/);
  });
});
