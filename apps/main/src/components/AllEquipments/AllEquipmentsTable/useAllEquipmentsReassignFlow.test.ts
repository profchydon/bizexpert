import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("useAllEquipmentsReassignFlow", () => {
  it("routes system reassignment and off-boarding flows separately", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/useAllEquipmentsReassignFlow.ts",
      ),
      "utf8",
    );

    assert.match(source, /System reassignment/);
    assert.match(source, /Off-boarding equipment/);
    assert.match(source, /openSystemReassign\(equipId/);
    assert.match(source, /startOffboardReassign/);
    assert.match(source, /resolveSystemReassignEquipId/);
    assert.match(source, /equip_id=\$\{equipId\}/);
  });
});

describe("AllEquipmentsTable reassign wiring", () => {
  it("opens the reassignment type modal before transfer drawers", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /ReassignSelectEquipmentModal/);
    assert.match(source, /openReassignTypeModal/);
    assert.match(
      source,
      /openSystemReassign: \(equipId\) => \{\s*setReassignEquipId\(equipId\);/,
    );
    assert.doesNotMatch(source, /setReassignEquipmentId/);
    assert.match(source, /startOffboardReassign/);
    assert.match(source, /startEquipmentOffboardReassign/);
    assert.match(source, /selectedRows=\{selectedRows\}/);
    assert.match(source, /isReAssignInstance=\{true\}/);
  });

  it("opens the actions drawer after store collection date like employee detail", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(
      source,
      /handleCollectDateNext[\s\S]*setIsActionDrawerOpen\(true\)/,
    );
  });
});
