import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const hris = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/HrisIntegrations.tsx",
  ),
  "utf8",
);

describe("hris catalog search spacing", () => {
  it("leaves space above the catalog search field", () => {
    assert.match(hris, /Search for integration/);
    assert.match(hris, /px-6 pb-6 pt-6/);
  });
});
