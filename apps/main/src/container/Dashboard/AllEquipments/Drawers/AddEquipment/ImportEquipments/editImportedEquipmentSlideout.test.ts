import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EditImportedEquipment slideout", () => {
  it("uses base form fields and slideout-relative layout", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/EditImportedEquipment/index.tsx",
      ),
      "utf8",
    );
    const form = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/AddEquipment/ImportEquipments/EditImportedEquipment/EditImportedEquipmentForm.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Go back/);
    assert.match(source, /addEquipmentFooterBorderClass/);
    assert.doesNotMatch(source, /fixed bottom-0/);
    assert.doesNotMatch(source, /DrawerRight/);
    assert.doesNotMatch(source, /updateVisibilityAfterDelay/);
    assert.match(form, /SingleEquipmentEditCoreFields/);
    assert.match(form, /countrySpan="half"/);
    assert.match(form, /EditImportedEquipmentPriceFields/);
    assert.match(form, /EquipmentEditImageField/);
  });
});

describe("mapImportedEquipmentToForm", () => {
  it("maps imported row values into the edit form", async () => {
    const { mapImportedEquipmentToForm, canSaveEditImportedEquipment } =
      await import("./EditImportedEquipment/mapImportedEquipmentToForm.ts");

    const values = mapImportedEquipmentToForm({
      title: "HP EliteDisplay",
      serial_number: "ee6e6072",
      type: "Tablet",
      state: "Brand_New",
      purchase_price: "3000",
      currency_id: "cur-ngn",
      purchase_date: "2024-04-05",
    } as never);

    assert.equal(values.title, "HP EliteDisplay");
    assert.equal(values.purchase_date, "2024-04-05");
    assert.equal(values.status, "unassigned");
    assert.equal(
      canSaveEditImportedEquipment(
        "HP EliteDisplay",
        "Tablet",
        "Brand_New",
        "3000",
        "cur-ngn",
        "unassigned",
        "",
      ),
      true,
    );
  });
});
