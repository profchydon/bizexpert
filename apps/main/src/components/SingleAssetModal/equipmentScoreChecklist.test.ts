import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { EquipmentConstant } from "@/types/equipments";
import { buildEquipmentScoreChecklist } from "./equipmentScoreChecklist.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("buildEquipmentScoreChecklist", () => {
  it("maps missing information to checklist rows with score weights", () => {
    const items = buildEquipmentScoreChecklist(
      [EquipmentConstant.serial_number, EquipmentConstant.assignee],
      "Unassigned",
    );

    assert.equal(items.length, 2);
    assert.deepEqual(
      items.map((item) => item.label),
      ["Add a serial number", "Assign it to an employee"],
    );
    assert.equal(items[0]?.weight, 10);
    assert.equal(items[1]?.weight, 40);
    assert.equal(items[0]?.buttonLabel, "Add");
    assert.equal(items[1]?.buttonLabel, "Assign");
  });

  it("disables refresh actions until the equipment is assigned", () => {
    const unassigned = buildEquipmentScoreChecklist(
      [EquipmentConstant.refresh_status],
      "Unassigned",
    );
    const assigned = buildEquipmentScoreChecklist(
      [EquipmentConstant.refresh_status],
      "Assigned",
    );

    assert.equal(unassigned[0]?.isDisabled, true);
    assert.match(
      unassigned[0]?.disabledReason ?? "",
      /assign the equipment before refreshing/i,
    );
    assert.equal(assigned[0]?.isDisabled, false);
    assert.equal(assigned[0]?.disabledReason, null);
  });

  it("ignores unknown missing information fields", () => {
    const items = buildEquipmentScoreChecklist(
      ["unknown_field", EquipmentConstant.country],
      "assigned",
    );

    assert.equal(items.length, 1);
    assert.equal(items[0]?.label, "Add a location");
  });
});

describe("EquipmentScoreModal", () => {
  it("uses the design-ui modal shell and base buttons", () => {
    const source = readFileSync(
      join(__dirname, "EquipmentScoreModal.tsx"),
      "utf8",
    );

    assert.match(source, /ModalOverlay/);
    assert.match(source, /FeaturedIcon/);
    assert.match(source, /MinusCircle/);
    assert.match(source, /color="secondary"/);
    assert.doesNotMatch(source, /@\/components\/ui\/dialog/);
  });
});
