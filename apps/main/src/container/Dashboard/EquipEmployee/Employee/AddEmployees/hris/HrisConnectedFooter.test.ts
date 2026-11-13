import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const footer = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/hris/HrisConnectedFooter.tsx",
  ),
  "utf8",
);
const hris = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/HrisIntegrations.tsx",
  ),
  "utf8",
);

describe("HrisConnectedFooter", () => {
  it("pins a compact action bar to the slideout instead of the viewport", () => {
    assert.match(footer, /data-testid="hris-connected-footer"/);
    assert.match(footer, /w-full shrink-0 border-t/);
    assert.match(footer, /form=\{formId\}/);
    assert.match(hris, /HrisConnectedFooter/);
    assert.match(hris, /id="hris-connected-config"/);
    assert.doesNotMatch(hris, /fixed bottom-0 left-0 w-full/);
    assert.doesNotMatch(hris, /mt-auto shrink-0 border-t/);
  });
});
