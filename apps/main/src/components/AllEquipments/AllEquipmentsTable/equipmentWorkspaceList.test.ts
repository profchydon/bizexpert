import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const table = readFileSync(
  "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
  "utf8",
);
const scope = readFileSync(
  "src/components/AllEquipments/useEquipmentEntityScope.ts",
  "utf8",
);

describe("equipmentWorkspaceList", () => {
  it("loads entity Asset Vault from the workspace equipment query", () => {
    assert.match(table, /skip: !companyId,/);
    assert.doesNotMatch(table, /Boolean\(entityId\)/);
    assert.doesNotMatch(table, /useEquipmentEntityScope/);
    assert.doesNotMatch(table, /equipmentBelongsToEntity/);
  });

  it("does not drop workspace equipment by country-to-entity matching", () => {
    assert.doesNotMatch(scope, /equipmentBelongsToEntity/);
  });
});
