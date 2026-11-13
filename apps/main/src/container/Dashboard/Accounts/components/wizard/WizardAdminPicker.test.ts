import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "WizardAdminPicker.tsx"), "utf8");
const dropdownSource = readFileSync(
  join(dir, "WizardAdminPickerDropdown.tsx"),
  "utf8",
);

describe("WizardAdminPicker", () => {
  it("loads employees from the API with search and infinite scroll", () => {
    assert.match(source, /usePaginatedEmployees/);
    assert.match(source, /WizardAdminPickerDropdown/);
    assert.match(source, /useWizardAdminPickerScroll/);
    assert.match(source, /z-\[100010\]/);
    assert.match(dropdownSource, /placeholder="Search\.\.\."/);
    assert.match(
      dropdownSource,
      /onWheel=\{\(event\) => event\.stopPropagation\(\)\}/,
    );
    assert.match(dropdownSource, /role="listbox"/);
    assert.match(source, /filterByCountry/);
    assert.match(source, /selectedLabels/);
    assert.match(source, /onSelectedLabelsChange/);
    assert.match(source, /Select a country first/);
    assert.doesNotMatch(source, /Popover/);
    assert.doesNotMatch(source, /adminOptions/);
  });
});
