import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  resolveOffboardReassignEquipment,
  validateOffboardReassignSelection,
} from "./equipmentOffboardReassignFlow.ts";

describe("equipmentOffboardReassignFlow", () => {
  it("prefers bulk selection over a single row item", () => {
    const bulk = [{ id: "eq-1", status: "assigned" }] as any[];
    const single = { id: "eq-2", status: "assigned" } as any;

    assert.deepEqual(resolveOffboardReassignEquipment(single, bulk), bulk);
    assert.deepEqual(resolveOffboardReassignEquipment(single, []), [single]);
  });

  it("requires a single assignee for off-board reassignment", () => {
    const mixed = validateOffboardReassignSelection([
      {
        id: "eq-1",
        status: "assigned",
        assignee: { id: "emp-1", name: "Ada Lovelace" },
      },
      {
        id: "eq-2",
        status: "assigned",
        assignee: { id: "emp-2", name: "Grace Hopper" },
      },
    ] as any);

    assert.equal(mixed.ok, false);
    if (!mixed.ok) {
      assert.match(mixed.message, /same employee/i);
    }

    const valid = validateOffboardReassignSelection([
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

describe("startEquipmentOffboardReassign", () => {
  it("delegates reassign intent to the shared offboard disposition flow", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/startEquipmentOffboardReassign.ts",
      ),
      "utf8",
    );

    assert.match(source, /disposition: "REASSIGN"/);
    assert.match(source, /startEquipmentOffboardDisposition/);
  });
});

describe("useEquipmentSidebarActions off-board routing", () => {
  it("routes off-boarding equipment into the employee offboard-devices flow", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/useEquipmentSidebarActions.ts",
      ),
      "utf8",
    );

    assert.match(source, /Off-boarding equipment/);
    assert.match(source, /startEquipmentOffboardReassign/);
  });
});
