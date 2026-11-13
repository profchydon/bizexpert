import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const drawers = join(
  process.cwd(),
  "src/container/Dashboard/AllEquipments/Drawers",
);

describe("EquipmentEditSpecFields form typing", () => {
  it("accepts the typed add/edit form instead of Control<any>", () => {
    const specFields = readFileSync(
      join(drawers, "EquipmentEditSpecFields.tsx"),
      "utf8",
    );
    const addForm = readFileSync(
      join(drawers, "AddEquipment/SingleEquipmentAddForm.tsx"),
      "utf8",
    );
    const editForm = readFileSync(
      join(drawers, "SingleEquipmentEditForm.tsx"),
      "utf8",
    );

    assert.match(specFields, /form: UseFormReturn<FormValues>/);
    assert.match(specFields, /toEquipmentSpecFields/);
    assert.doesNotMatch(specFields, /Control<any>/);
    assert.match(addForm, /<EquipmentEditSpecFields form=\{form\} \/>/);
    assert.match(editForm, /<EquipmentEditSpecFields form=\{form\} \/>/);
  });

  it("uses the Product Information device specification card", () => {
    const specFields = readFileSync(
      join(drawers, "EquipmentEditSpecFields.tsx"),
      "utf8",
    );
    const specField = readFileSync(
      join(drawers, "EquipmentEditSpecField.tsx"),
      "utf8",
    );

    assert.match(specFields, />Specification</);
    assert.doesNotMatch(specFields, /Device Specification/);
    assert.doesNotMatch(specFields, /ensureEquipmentConditionSpec/);
    assert.doesNotMatch(specFields, /isCondition/);
    assert.match(specFields, /Add Specification/);
    assert.match(specFields, /DEVICE_SPEC_OPTIONS/);
    assert.doesNotMatch(
      readFileSync(
        join(drawers, "deviceSpecification/deviceSpecificationOptions.ts"),
        "utf8",
      ),
      /label: "Condition"/,
    );
    assert.match(specFields, /isRestrictedSpecKey/);
    assert.match(specField, /Select value/);
    assert.match(specField, /restrictValue/);
    assert.match(specField, /specSuggestions/);
  });

  it("keeps heading and add control on a tight stack", () => {
    const specFields = readFileSync(
      join(drawers, "EquipmentEditSpecFields.tsx"),
      "utf8",
    );

    assert.match(specFields, /flex flex-col gap-1.5/);
    assert.match(specFields, /specFields.length > 0/);
    assert.doesNotMatch(specFields, /gap-4 px-4 pt-4 pb-4/);
  });
});
