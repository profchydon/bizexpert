import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("AddEquipment purchase date limit", () => {
  it("caps the date input at today on the add form only", () => {
    const addForm = read(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddForm.tsx",
    );
    const coreFields = read(
      "src/container/Dashboard/AllEquipments/Drawers/SingleEquipmentEditCoreFields.tsx",
    );

    assert.match(addForm, /maxPurchaseDate=\{todayIsoDate\(\)\}/);
    assert.match(coreFields, /maxPurchaseDate\?: string/);
    assert.match(coreFields, /max=\{maxPurchaseDate\}/);
  });

  it("forwards max through to the native input element", () => {
    const input = read("src/components/base/input/input.tsx");

    assert.match(input, /max\?: string \| number/);
    assert.match(input, /min,\s*\n\s*max,\s*\n\s*\.\.\.props/);
    assert.match(
      input,
      /tooltipClassName,\s*\n\s*min,\s*\n\s*max,\s*\n\s*\}\}/,
    );
  });

  it("blocks saving when a future purchase date is typed in", async () => {
    const { canSaveAddEquipment, getAddEquipmentSaveDisabledReason } =
      await import("./submitSingleEquipmentCreate.ts");

    const args = [
      "MacBook",
      "Laptop/Workstation",
      "Brand_New",
      "unassigned",
      "",
      false,
    ] as const;

    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureDate = future.toISOString().slice(0, 10);

    assert.equal(canSaveAddEquipment(...args, futureDate), false);
    assert.equal(
      getAddEquipmentSaveDisabledReason(...args, futureDate),
      "Purchase date cannot be in the future.",
    );
  });

  it("still saves with an empty or past purchase date", async () => {
    const { canSaveAddEquipment, getAddEquipmentSaveDisabledReason } =
      await import("./submitSingleEquipmentCreate.ts");

    const args = [
      "MacBook",
      "Laptop/Workstation",
      "Brand_New",
      "unassigned",
      "",
      false,
    ] as const;

    assert.equal(canSaveAddEquipment(...args, ""), true);
    assert.equal(canSaveAddEquipment(...args, "2020-01-01"), true);
    assert.equal(
      getAddEquipmentSaveDisabledReason(...args, "2020-01-01"),
      null,
    );
  });

  it("passes the watched purchase date into both save guards", () => {
    const hook = read(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
    );
    const addTab = read(
      "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddTab.tsx",
    );

    assert.match(hook, /String\(watched\.purchase_date \?\? ""\)/);
    assert.match(addTab, /String\(watched\.purchase_date \?\? ""\)/);
  });
});
