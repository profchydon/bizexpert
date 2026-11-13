import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { validateOffboardStoreSelection } from "./equipmentOffboardStoreFlow.ts";

describe("equipmentOffboardStoreFlow", () => {
  it("requires assigned equipment with a single assignee", () => {
    const unassigned = validateOffboardStoreSelection([
      {
        id: "eq-1",
        status: "Unassigned",
        assignee: { id: "Unassigned", name: "Unassigned" },
      },
    ] as any);

    assert.equal(unassigned.ok, false);
    if (!unassigned.ok) {
      assert.match(
        unassigned.message,
        /isn't available for the selected equipment/i,
      );
    }

    const valid = validateOffboardStoreSelection([
      {
        id: "eq-1",
        status: "assigned",
        assignee: { id: "emp-1", name: "Ada Lovelace" },
      },
      {
        id: "eq-2",
        status: "assigned",
        assignee: { id: "emp-1", name: "Ada Lovelace" },
      },
    ] as any);

    assert.deepEqual(valid, {
      ok: true,
      assigneeId: "emp-1",
      deviceIds: ["eq-1", "eq-2"],
    });
  });
});

describe("startEquipmentOffboardStore", () => {
  it("delegates store intent to the shared offboard disposition flow", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/startEquipmentOffboardStore.ts",
      ),
      "utf8",
    );

    assert.match(source, /disposition: "STORE"/);
    assert.match(source, /startEquipmentOffboardDisposition/);
  });
});

describe("startEquipmentOffboardDisposition", () => {
  it("routes into the employee offboard-devices page", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/startEquipmentOffboardDisposition.ts",
      ),
      "utf8",
    );

    assert.match(source, /EMPLOYEES_OFFBOARD_DEVICES/);
  });
});

describe("AllEquipmentsTable store wiring", () => {
  it("uses the employee offboard store flow for bulk and row actions", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(source, /startOffboardStore/);
    assert.match(source, /startEquipmentOffboardStore/);
    assert.match(source, /onStore: \(\) => startOffboardStore\(\)/);
  });
});

describe("useEquipmentSidebarActions store routing", () => {
  it("routes store equipment into the employee offboard-devices flow", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/useEquipmentSidebarActions.ts",
      ),
      "utf8",
    );

    assert.match(source, /startEquipmentOffboardStore/);
  });
});
