import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const DRAWERS = "src/container/Dashboard/AllEquipments/Drawers";

describe("locked country and currency fields", () => {
  it("keeps the country select enabled", () => {
    const coreFields = read(`${DRAWERS}/SingleEquipmentEditCoreFields.tsx`);
    const countryField = read(`${DRAWERS}/SingleEquipmentCountryField.tsx`);

    assert.doesNotMatch(coreFields, /isDisabled=\{isCountryLocked\}/);
    assert.doesNotMatch(coreFields, /isCountryLocked/);
    assert.doesNotMatch(countryField, /isDisabled/);
    assert.doesNotMatch(countryField, /isCountryLocked/);
  });

  it("disables the currency select and shows the override hint", () => {
    const priceFields = read(
      `${DRAWERS}/AddEquipment/SingleEquipmentAddPriceFields.tsx`,
    );

    assert.match(priceFields, /disabled=\{isCurrencyLocked\}/);
    assert.match(
      priceFields,
      /hint=\{fieldState\.error\?\.message \?\? currencyHint\}/,
    );
  });

  it("drives both add and edit from the workspace defaults hook", () => {
    const addHook = read(
      `${DRAWERS}/AddEquipment/useSingleEquipmentAddForm.ts`,
    );
    const editHook = read(`${DRAWERS}/useSingleEquipmentEditForm.ts`);

    for (const hook of [addHook, editHook]) {
      assert.match(hook, /useWorkspaceEquipmentDefaults/);
      assert.match(hook, /buildWorkspaceCurrencyItems/);
    }
  });

  it("defaults the add form country without overwriting a chosen value", () => {
    const addHook = read(
      `${DRAWERS}/AddEquipment/useSingleEquipmentAddForm.ts`,
    );

    assert.match(addHook, /form\.setValue\("currency_id", currencyId\)/);
    assert.match(addHook, /applyWorkspaceCountryDefault/);
    assert.doesNotMatch(addHook, /isCountryLocked/);
  });

  it("keeps the saved country when resetting the edit form", () => {
    const editHook = read(`${DRAWERS}/useSingleEquipmentEditForm.ts`);

    assert.doesNotMatch(
      editHook,
      /countryName \? \{ country: countryName \} : \{\}/,
    );
    assert.match(
      editHook,
      /currencyId \? \{ currency_id: currencyId \} : \{\}/,
    );
    assert.doesNotMatch(editHook, /hasWorkspaceOverride\(savedCountry/);
    assert.match(
      editHook,
      /hasWorkspaceOverride\(savedCurrencyCode, currencyCode\)/,
    );
    assert.doesNotMatch(editHook, /isCountryLocked/);
  });
});

describe("edit form parity with add", () => {
  it("renders the office picker, price fields and capped purchase date", () => {
    const editForm = read(`${DRAWERS}/SingleEquipmentEditForm.tsx`);

    assert.match(editForm, /SingleEquipmentAddOfficeField/);
    assert.match(editForm, /SingleEquipmentAddPriceFields/);
    assert.match(editForm, /maxPurchaseDate=\{todayIsoDate\(\)\}/);
  });

  it("filters edit office options by the workspace company", () => {
    const editHook = read(`${DRAWERS}/useSingleEquipmentEditForm.ts`);

    assert.match(
      editHook,
      /selectOfficesForCompany\(\s*getOffices\?\.data\?\.data,\s*workspaceCompanyId,?\s*\)/,
    );
  });

  it("blocks saving an edit with a future purchase date", async () => {
    const { canSaveEditEquipment, getEditEquipmentSaveDisabledReason } =
      await import("./editSingleEquipmentForm.ts");

    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureDate = future.toISOString().slice(0, 10);

    assert.equal(
      canSaveEditEquipment(
        "MacBook",
        "Laptop",
        "New",
        false,
        false,
        futureDate,
      ),
      false,
    );
    assert.equal(
      canSaveEditEquipment(
        "MacBook",
        "Laptop",
        "New",
        false,
        false,
        "2020-01-01",
      ),
      true,
    );
    assert.equal(
      getEditEquipmentSaveDisabledReason(
        "MacBook",
        "Laptop",
        "New",
        false,
        false,
        "equipment-1",
        futureDate,
      ),
      "Purchase date cannot be in the future.",
    );
  });

  it("sends office_id from the shared payload builder for both flows", async () => {
    const { buildSingleEquipmentEditFormData } =
      await import("./submitSingleEquipmentEdit.ts");

    const base = {
      title: "MacBook",
      type: "Laptop/Workstation",
      state: "Brand_New",
      properties: [],
    };

    assert.equal(
      buildSingleEquipmentEditFormData(
        { ...base, office_id: "office-1" },
        undefined,
      ).get("office_id"),
      "office-1",
    );
    assert.equal(
      buildSingleEquipmentEditFormData(
        { ...base, office_id: "" },
        undefined,
      ).get("office_id"),
      null,
    );
    assert.equal(
      buildSingleEquipmentEditFormData(
        { ...base, status: "Unassigned" },
        undefined,
      ).get("status"),
      "unassigned",
    );
  });

  it("maps the saved office onto the edit form", async () => {
    const { mapEquipmentToEditForm } =
      await import("./submitSingleEquipmentEdit.ts");

    const values = mapEquipmentToEditForm(
      { title: "MacBook", office: { id: "office-9", name: "Lagos" } } as never,
      [],
    );

    assert.equal(values.office_id, "office-9");
    assert.equal(values.status, "unassigned");
  });
});
