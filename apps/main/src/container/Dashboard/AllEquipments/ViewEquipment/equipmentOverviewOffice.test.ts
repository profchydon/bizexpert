import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const overview = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentDetail/EquipmentOverview.tsx",
  ),
  "utf8",
);

describe("equipment overview office field", () => {
  it("renders the office name after Location", () => {
    assert.match(overview, /label="Office"/);
    assert.match(overview, /equipment\?\.office\?\.name/);
    assert.match(overview, /label="Location"[\s\S]*?label="Office"/);
  });

  it("links the office name through the resolved office href", () => {
    assert.match(overview, /import Link from "next\/link"/);
    assert.match(
      overview,
      /useEquipmentOfficeHref\(equipment\?\.office\?\.id\)/,
    );
    assert.match(overview, /href=\{officeHref\}/);
    assert.match(overview, /hover:underline/);
  });

  it("keeps the office name as text until an href resolves", () => {
    assert.match(
      overview,
      /officeHref \? \([\s\S]*?\) : \(\s*<span className="block">\{equipment\.office\.name\}<\/span>/,
    );
  });

  it("keeps office and equipment type free of icon shells", () => {
    assert.doesNotMatch(overview, /Building07/);
    assert.doesNotMatch(overview, /getEquipmentTypeIcon/);
    assert.doesNotMatch(overview, /icon=\{TypeIcon\}/);
  });

  it("shows the office area under the office name when one is set", () => {
    assert.match(overview, /equipment\?\.office_area\?\.name/);
    assert.match(overview, /equipment\.office_area\.name/);
  });

  it("falls back to the shared empty value when the asset has no office", () => {
    assert.match(
      overview,
      /equipment\?\.office\?\.name \? \([\s\S]*?\) : \(\s*EQUIPMENT_DETAIL_EMPTY_VALUE/,
    );
  });
});
