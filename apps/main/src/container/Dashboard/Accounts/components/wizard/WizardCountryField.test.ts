import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(dir, "WizardCountryField.tsx"), "utf8");

describe("WizardCountryField", () => {
  it("uses a searchable combobox with country flags", () => {
    assert.match(source, /WizardRegionFlag/);
    assert.match(source, /useGetCountriesQuery/);
    assert.match(source, /mapCountriesToWizardOptions/);
    assert.match(source, /role="combobox"/);
    assert.match(source, /role="listbox"/);
    assert.match(source, /Select country of registration/);
    assert.match(source, /border-primary-600 ring-2 ring-primary-600\/20/);
    assert.doesNotMatch(source, /Popover/);
    assert.doesNotMatch(source, /ItemIndicator/);
    assert.doesNotMatch(source, /regionOptions/);
  });
});
