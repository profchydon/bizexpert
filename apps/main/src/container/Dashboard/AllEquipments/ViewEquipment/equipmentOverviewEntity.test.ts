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

const hook = readFileSync(
  join(process.cwd(), "src/hooks/useOfficeDetailHref.ts"),
  "utf8",
);

const equipmentHook = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/AllEquipments/ViewEquipment/useEquipmentOfficeHref.ts",
  ),
  "utf8",
);

describe("equipment office lookup", () => {
  it("fetches the one office the asset sits in rather than the office list", () => {
    assert.match(hook, /useGetOfficeQuery\(\s*\{\s*companyId[\s\S]*?officeId/);
    assert.match(hook, /skip: !companyId \|\| !officeId/);
  });

  it("falls back to the office list only when the single fetch errors", () => {
    assert.match(
      hook,
      /useGetOfficesQuery\([\s\S]*?skip: !companyId \|\| !officeId \|\| !detail\.isError/,
    );
    assert.match(
      hook,
      /detail\.data\?\.data \?\? findOfficeById\(list\.data\?\.data\?\.data, officeId\)/,
    );
  });

  it("shares the resolved office between the office and entity hooks", () => {
    assert.match(hook, /export function useOfficeDetailHref/);
    assert.match(hook, /export function useOfficeEntity/);
    assert.equal(hook.match(/useOfficeLookup\(officeId\)/g)?.length, 2);
  });

  it("keeps the equipment hook names pointing at the shared lookup", () => {
    assert.match(
      equipmentHook,
      /useOfficeDetailHref as useEquipmentOfficeHref/,
    );
    assert.match(equipmentHook, /useOfficeEntity as useEquipmentOfficeEntity/);
    assert.match(equipmentHook, /from "@\/hooks\/useOfficeDetailHref"/);
  });
});

describe("equipment overview entity field", () => {
  it("resolves the entity from the office the asset sits in", () => {
    assert.match(
      overview,
      /useEquipmentOfficeEntity\(equipment\?\.office\?\.id\)/,
    );
    assert.match(hook, /officeEntityRef\(office, company\)/);
  });

  it("links the entity name to the entity detail page", () => {
    assert.match(hook, /routes\.SUBSIDIARY_DETAIL\(entity\.id\)/);
    assert.match(overview, /label="Entity"/);
    assert.match(overview, /href=\{officeEntity\.href\}/);
    assert.match(overview, /\{officeEntity\.name\}/);
    assert.match(overview, /hover:underline/);
  });

  it("shows the entity right after the office", () => {
    assert.match(overview, /label="Office"[\s\S]*?label="Entity"/);
    assert.match(overview, /label="Entity"[\s\S]*?label="Make"/);
  });

  it("falls back to the shared empty value when nothing resolves", () => {
    assert.match(
      overview,
      /officeEntity \? \([\s\S]*?\) : \(\s*EQUIPMENT_DETAIL_EMPTY_VALUE/,
    );
  });
});
