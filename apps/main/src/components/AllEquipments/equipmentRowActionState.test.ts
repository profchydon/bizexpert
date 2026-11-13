import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  getRowActionDisabledState,
  getTransferActionLabel,
} from "./equipmentRowActionState.ts";

describe("equipmentRowActionState", () => {
  it("returns lifecycle reasons before pending conflicts", () => {
    const lifecycle = getRowActionDisabledState("in_storage", "transfer");
    assert.equal(lifecycle.isDisabled, true);
    assert.match(lifecycle.reason ?? "", /in storage/i);

    const pending = getRowActionDisabledState("assigned", "transfer", "Store");
    assert.equal(pending.isDisabled, true);
    assert.match(pending.reason ?? "", /pending store action/i);

    const enabled = getRowActionDisabledState("Unassigned", "transfer");
    assert.equal(enabled.isDisabled, false);
    assert.equal(enabled.reason, null);

    const unassignedStore = getRowActionDisabledState("Unassigned", "store");
    assert.equal(unassignedStore.isDisabled, true);
    assert.match(unassignedStore.reason ?? "", /unassigned equipment/i);
  });

  it("labels transfer actions from lifecycle status", () => {
    assert.equal(getTransferActionLabel("assigned"), "Reassign equipment");
    assert.equal(getTransferActionLabel("Unassigned"), "Assign equipment");
  });
});

describe("EquipmentTableActionMenuItems", () => {
  it("always renders assign and store actions with shared disabled state", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/components/AllEquipments/AllEquipmentsTable/EquipmentTableActionMenuItems.tsx",
      ),
      "utf8",
    );

    assert.match(source, /getRowActionDisabledState/);
    assert.match(source, /getTransferActionLabel/);
    assert.match(source, /Store equipment/);
    assert.match(source, /onClick=\{onEdit\}/);
    assert.match(source, /onClick=\{onTransfer\}/);
    assert.match(source, /onClick=\{onStore\}/);
    assert.equal(source.includes("equipmentMenuNeedsUpgrade"), false);
    assert.doesNotMatch(source, /canPerformAction\(equipmentStatus/);
  });
});

describe("EquipmentDetailsActions", () => {
  it("uses shared row action disabled state in the detail dropdown", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/ViewEquipment/EquipmentDetailsLayout/EquipmentSidebar/EquipmentDetailsActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /getRowActionDisabledState/);
    assert.match(source, /getTransferActionLabel/);
    assert.doesNotMatch(source, /canPerformAction/);
  });
});
