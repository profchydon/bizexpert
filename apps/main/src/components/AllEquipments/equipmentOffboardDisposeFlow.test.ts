import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import { validateOffboardDisposeSelection } from "./equipmentOffboardDisposeFlow.ts";

describe("equipmentOffboardDisposeFlow", () => {
  it("requires assigned equipment with a single assignee", () => {
    const unassigned = validateOffboardDisposeSelection([
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

    const valid = validateOffboardDisposeSelection([
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

describe("startEquipmentOffboardDispose", () => {
  it("delegates dispose intent to the shared offboard disposition flow", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/startEquipmentOffboardDispose.ts",
      ),
      "utf8",
    );

    assert.match(source, /disposition: "DISPOSE"/);
    assert.match(source, /startEquipmentOffboardDisposition/);
  });
});
