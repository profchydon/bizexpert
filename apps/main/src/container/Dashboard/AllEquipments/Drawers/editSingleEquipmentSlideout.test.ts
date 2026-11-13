import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EditSingleEquipment slideout", () => {
  it("uses SlideoutMenu shell with reference layout and base form fields", () => {
    const slideout = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/EditSingleEquipment.tsx",
      ),
      "utf8",
    );
    const form = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/AllEquipments/Drawers/SingleEquipmentEditCoreFields.tsx",
      ),
      "utf8",
    );

    assert.match(slideout, /SlideoutMenu/);
    assert.match(
      slideout,
      /resizeOptions=\{EDIT_SINGLE_EQUIPMENT_SLIDEOUT_RESIZE\}/,
    );
    assert.match(slideout, /Edit Equipment/);
    assert.match(slideout, /Make updates to existing equipment\./);
    assert.match(slideout, /font-bold text-primary/);
    assert.match(slideout, /h-px w-full shrink-0 bg-border-secondary/);
    assert.match(slideout, /border-t border-secondary px-6 py-4/);
    assert.doesNotMatch(slideout, /DrawerRight/);
    assert.doesNotMatch(slideout, /AddEquipment\/SingleEquipment/);
    assert.match(form, /@\/components\/base\/input\/input/);
    assert.match(form, /Asset title/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/SingleEquipmentEditForm.tsx",
        ),
        "utf8",
      ),
      /EquipmentEditSpecFields/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/SingleEquipmentEditForm.tsx",
        ),
        "utf8",
      ),
      /EquipmentEditImageField/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/EquipmentEditSpecFields.tsx",
        ),
        "utf8",
      ),
      /hover:bg-secondary hover:text-secondary/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/EquipmentEditSpecField.tsx",
        ),
        "utf8",
      ),
      /focus-within:ring-2 focus-within:ring-brand/,
    );
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/AllEquipments/Drawers/editSingleEquipmentSlideoutResize.ts",
        ),
        "utf8",
      ),
      /initial: 880/,
    );
  });
});

describe("editSingleEquipmentForm helpers", () => {
  it("enables save when required fields are present", async () => {
    const { canSaveEditEquipment } =
      await import("./editSingleEquipmentForm.ts");

    assert.equal(
      canSaveEditEquipment(
        "HP-PROBK",
        "Laptop/Workstation",
        "Brand_New",
        false,
        false,
      ),
      true,
    );
    assert.equal(
      canSaveEditEquipment(
        "H",
        "Laptop/Workstation",
        "Brand_New",
        false,
        false,
      ),
      false,
    );
    assert.equal(
      canSaveEditEquipment("HP", "", "Brand_New", false, false),
      false,
    );
  });

  it("maps equipment specs and purchase date into edit form values", async () => {
    const { mapEquipmentToEditForm } =
      await import("./submitSingleEquipmentEdit.ts");

    const values = mapEquipmentToEditForm(
      {
        title: "HP-PROBK-3J9P7M",
        serial_number: "HJGASJGS",
        make: "HP",
        model: "Elitebook",
        year: "2026",
        type: "Laptop/Workstation",
        state: "Brand_New",
        country: "United States",
        specs: { Memory: "192GB RAM", Processor: "Intel Core i5" },
        purchase_date: "2026-07-23T00:00:00.000Z",
      } as never,
      [{ id: "us", name: "United States", code: "US" }],
    );

    assert.equal(values.title, "HP-PROBK-3J9P7M");
    assert.equal(values.country, "United States");
    assert.equal(values.purchase_date, "2026-07-23");
    assert.equal(values.properties?.length, 2);
    assert.equal(values.properties?.[0]?.fieldName, "memory");
  });
});
