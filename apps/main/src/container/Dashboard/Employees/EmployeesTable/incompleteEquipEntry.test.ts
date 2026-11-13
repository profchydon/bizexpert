import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const header = readFileSync(join(dir, "EmployeesSelectionHeader.tsx"), "utf8");
const table = readFileSync(join(dir, "index.tsx"), "utf8");

describe("employees table equip entry", () => {
  it("wires Equip Employee on the employees selection bar", () => {
    assert.match(header, /Equip Employee/);
    assert.match(header, /onEquip/);
    assert.match(header, /isEquipLoading/);
    assert.match(table, /useEquipEmployees/);
    assert.match(table, /onEquip=\{equip\.start\}/);
  });
});
