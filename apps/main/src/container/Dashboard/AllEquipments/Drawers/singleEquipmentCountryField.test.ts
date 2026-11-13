import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const DRAWERS = "src/container/Dashboard/AllEquipments/Drawers";

describe("SingleEquipmentCountryField", () => {
  it("uses a searchable ComboBox instead of a closed Select", () => {
    const field = readFileSync(
      join(process.cwd(), `${DRAWERS}/SingleEquipmentCountryField.tsx`),
      "utf8",
    );
    const core = readFileSync(
      join(process.cwd(), `${DRAWERS}/SingleEquipmentEditCoreFields.tsx`),
      "utf8",
    );

    assert.match(field, /Select\.ComboBox/);
    assert.match(field, /label="Select Country"/);
    assert.match(field, /size="md"/);
    assert.match(field, /placeholder="Search country"/);
    assert.match(field, /name="country"/);
    assert.match(field, /withCurrentSelectOption/);
    assert.doesNotMatch(field, /isDisabled/);
    assert.match(core, /SingleEquipmentCountryField/);
    assert.doesNotMatch(core, /label="Select Country"/);
  });
});
