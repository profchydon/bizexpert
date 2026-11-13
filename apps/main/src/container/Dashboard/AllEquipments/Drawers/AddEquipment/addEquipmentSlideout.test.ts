import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("AddEquipment slideout flow", () => {
  it("uses SlideoutMenu shell with underline tabs and tab panels", () => {
    const index = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/index.tsx",
      ),
      "utf8",
    );
    const shell = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/addEquipmentSlideoutShell.tsx",
      ),
      "utf8",
    );
    const tabs = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/addEquipmentPanelTabs.tsx",
      ),
      "utf8",
    );

    assert.match(index, /AddEquipmentSlideoutShell/);
    assert.match(index, /SingleEquipmentAddTab/);
    assert.match(index, /ImportEquipments/);
    assert.doesNotMatch(index, /DrawerRight/);
    assert.doesNotMatch(index, /AddEquipmentLayout/);
    assert.match(shell, /SlideoutMenu/);
    assert.match(shell, /ADD_EQUIPMENT_SLIDEOUT_RESIZE/);
    assert.match(tabs, /Import equipment[\s\S]*Add equipment/);
    assert.match(tabs, /border-fg-brand-primary_alt text-brand-secondary/);
  });

  it("uses design-ui upload panel and add tab form shell", () => {
    const upload = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/ImportEquipmentUploadPanel.tsx",
      ),
      "utf8",
    );
    const addTab = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddTab.tsx",
      ),
      "utf8",
    );

    assert.match(upload, /FileUpload\.DropZone/);
    assert.match(upload, /Download template/);
    assert.doesNotMatch(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/index.tsx",
        ),
        "utf8",
      ),
      /fixed bottom-0/,
    );
    assert.match(addTab, /SingleEquipmentAddForm/);
    assert.match(addTab, /addEquipmentFooterBorderClass/);
    assert.doesNotMatch(addTab, /DrawerRight/);

    const addForm = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddForm.tsx",
      ),
      "utf8",
    );
    assert.match(addForm, /countrySpan="half"/);
    assert.match(addForm, /SingleEquipmentAddPriceFields/);
    assert.match(addForm, /currencyItems=\{currencyItems\}/);
  });

  it("renders purchase price and currency fields on the add tab", () => {
    const priceFields = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddPriceFields.tsx",
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
    const addTab = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/SingleEquipmentAddTab.tsx",
      ),
      "utf8",
    );

    assert.match(priceFields, /name="purchase_price"/);
    assert.match(priceFields, /label="Purchase price"/);
    assert.match(priceFields, /name="currency_id"/);
    assert.match(priceFields, /InputGroup/);
    assert.match(priceFields, /trailingAddon=\{/);
    assert.match(priceFields, /NativeSelect/);
    assert.match(priceFields, /placeholder="1,000\.00"/);
    assert.match(priceFields, /inputMode="decimal"/);
    assert.match(hook, /useWorkspaceEquipmentDefaults/);
    assert.match(hook, /buildWorkspaceCurrencyItems/);
    assert.match(addTab, /currencyItems=\{currencyItems\}/);
  });
});

describe("submitSingleEquipmentCreate", () => {
  it("requires assignee when status is Assigned", async () => {
    const { canSaveAddEquipment } =
      await import("./submitSingleEquipmentCreate.ts");

    assert.equal(
      canSaveAddEquipment(
        "MacBook",
        "Laptop/Workstation",
        "Brand_New",
        "Assigned",
        "",
        false,
      ),
      false,
    );
    assert.equal(
      canSaveAddEquipment(
        "MacBook",
        "Laptop/Workstation",
        "Brand_New",
        "Assigned",
        "emp-1",
        false,
      ),
      true,
    );
    assert.equal(
      canSaveAddEquipment(
        "MacBook",
        "Laptop/Workstation",
        "Brand_New",
        "unassigned",
        "",
        false,
      ),
      true,
    );
  });

  it("sends purchase price and currency in the create payload", async () => {
    const { buildCreateEquipmentFormData } =
      await import("./submitSingleEquipmentCreate.ts");

    const formData = buildCreateEquipmentFormData(
      {
        title: "MacBook",
        type: "Laptop/Workstation",
        state: "Brand_New",
        properties: [],
        purchase_price: "3000",
        currency_id: "currency-1",
      },
      undefined,
    );

    assert.equal(formData.get("purchase_price"), "3000");
    assert.equal(formData.get("currency_id"), "currency-1");
    assert.equal(formData.get("status"), "unassigned");
  });
});
