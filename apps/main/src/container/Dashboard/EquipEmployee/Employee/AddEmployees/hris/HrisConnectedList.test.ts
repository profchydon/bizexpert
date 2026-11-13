import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const list = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/hris/HrisConnectedList.tsx",
  ),
  "utf8",
);
const button = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/hris/HrisConnectMoreButton.tsx",
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

describe("HrisConnectedList", () => {
  it("spaces the connected list instead of stretching an empty slideout column", () => {
    assert.match(list, /data-testid="hris-connected-list"/);
    assert.match(list, /flex flex-col gap-4 px-6 pb-6 pt-6/);
    assert.doesNotMatch(list, /flex-1/);
    assert.match(hris, /HrisConnectedList/);
    assert.match(button, /useTransitionRouter/);
    assert.match(button, /SETTINGS_INTEGRATIONS/);
  });
});
