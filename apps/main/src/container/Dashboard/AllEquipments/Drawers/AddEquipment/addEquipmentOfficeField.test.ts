import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("AddEquipment office assignment", () => {
  it("renders an Assign to office field backed by the offices query", () => {
    const officeField = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddOfficeField.tsx",
      ),
      "utf8",
    );
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
      ),
      "utf8",
    );
    const validation = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipment/validation.ts",
      ),
      "utf8",
    );

    assert.match(officeField, /label="Assign to office"/);
    assert.match(officeField, /name="office_id"/);
    assert.match(officeField, /Select\.ComboBox/);
    assert.match(officeField, /Building07/);
    assert.match(validation, /office_id: z\.string\(\)\.optional\(\)/);
    assert.match(hook, /useGetOfficesQuery/);
    assert.match(hook, /buildEquipmentOfficeItems/);
    assert.doesNotMatch(hook, /useAssignOfficeEquipmentsMutation/);
  });

  it("lists only offices owned by the active workspace company", () => {
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
      ),
      "utf8",
    );

    assert.match(hook, /useWorkspaceCompanyId/);
    assert.match(
      hook,
      /selectOfficesForCompany\(\s*getOffices\?\.data\?\.data,\s*workspaceCompanyId,?\s*\)/,
    );
  });

  it("preselects the office when the workspace owns exactly one", () => {
    const hook = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/useSingleEquipmentAddForm.ts",
      ),
      "utf8",
    );

    assert.match(hook, /officeItems\.length !== 1/);
    assert.match(hook, /form\.setValue\("office_id", officeItems\[0\]\.id\)/);
  });

  it("hides the field with no offices and locks it with a single office", () => {
    const officeField = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddOfficeField.tsx",
      ),
      "utf8",
    );

    assert.match(officeField, /officeItems\.length === 0\) return null/);
    assert.match(officeField, /officeItems\.length === 1/);
    assert.match(officeField, /isDisabled=\{isOnlyOffice\}/);
  });

  it("pairs the office field with purchase price on one row", () => {
    const officeField = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddOfficeField.tsx",
      ),
      "utf8",
    );
    const addForm = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddForm.tsx",
      ),
      "utf8",
    );

    assert.doesNotMatch(officeField, /col-span-2/);
    assert.match(
      addForm,
      /SingleEquipmentAddPriceFields[\s\S]*?SingleEquipmentAddOfficeField/,
    );
  });

  it("sends office_id in the create payload only when an office is picked", async () => {
    const { buildCreateEquipmentFormData } =
      await import("./submitSingleEquipmentCreate.ts");

    const base = {
      title: "MacBook",
      type: "Laptop/Workstation",
      state: "Brand_New",
      properties: [],
    };

    const withOffice = buildCreateEquipmentFormData(
      { ...base, office_id: "office-1" },
      undefined,
    );
    const withoutOffice = buildCreateEquipmentFormData(
      { ...base, office_id: "" },
      undefined,
    );

    assert.equal(withOffice.get("office_id"), "office-1");
    assert.equal(withoutOffice.get("office_id"), null);
  });
});
