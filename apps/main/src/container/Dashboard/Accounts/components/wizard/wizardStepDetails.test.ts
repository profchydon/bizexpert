import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

describe("WizardStepDetails entity admins", () => {
  it("uses the office admin picker backed by the company users directory", () => {
    const source = readFileSync(join(dir, "WizardStepDetails.tsx"), "utf8");

    assert.match(source, /OfficeAdminPicker/);
    assert.match(source, /admins\.options/);
    assert.match(source, /admins\.setQuery/);
    assert.match(source, /admins\.loadMore/);
    assert.match(source, /value=\{draft\.adminUserIds\}/);
    assert.doesNotMatch(source, /WizardAdminPicker/);
    assert.doesNotMatch(source, /filterByCountry/);
    assert.doesNotMatch(source, /adminUserLabels/);
  });
});
