import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EMPTY_EQUIPMENT_SPEC_FIELDS,
  optionsForEquipmentSpec,
  sameEquipmentSpecFields,
  toEquipmentSpecFields,
} from "./toEquipmentSpecFields";

describe("toEquipmentSpecFields", () => {
  it("returns an empty list when properties are missing", () => {
    assert.deepEqual(toEquipmentSpecFields(undefined), []);
    assert.deepEqual(toEquipmentSpecFields([]), []);
    assert.deepEqual(EMPTY_EQUIPMENT_SPEC_FIELDS, []);
  });

  it("drops undefined rows and fills missing names and values", () => {
    assert.deepEqual(
      toEquipmentSpecFields([
        undefined,
        { fieldName: "memory" },
        { fieldValue: "16GB" },
        { fieldName: "storage", fieldValue: "512GB" },
      ]),
      [
        { fieldName: "memory", fieldValue: "" },
        { fieldName: "", fieldValue: "16GB" },
        { fieldName: "storage", fieldValue: "512GB" },
      ],
    );
  });

  it("does not inject a condition row", () => {
    assert.deepEqual(
      toEquipmentSpecFields([{ fieldName: "storage", fieldValue: "1TB" }]),
      [{ fieldName: "storage", fieldValue: "1TB" }],
    );
  });

  it("keeps a saved spec key that is not in the catalogue list", () => {
    const options = optionsForEquipmentSpec("memory", new Set(["memory"]));
    assert.equal(options[0]?.value, "memory");
    assert.equal(options[0]?.label, "Memory");
  });

  it("does not offer condition in the specification type list", () => {
    const options = optionsForEquipmentSpec("", new Set());
    assert.equal(
      options.some((option) => option.value === "condition"),
      false,
    );
  });

  it("compares spec rows by name and value", () => {
    const storage = [{ fieldName: "storage", fieldValue: "1TB" }];
    assert.equal(sameEquipmentSpecFields(storage, storage), true);
    assert.equal(
      sameEquipmentSpecFields(storage, [
        { fieldName: "storage", fieldValue: "512GB" },
      ]),
      false,
    );
  });
});
