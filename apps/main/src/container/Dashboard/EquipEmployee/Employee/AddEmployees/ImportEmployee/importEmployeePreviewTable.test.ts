import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("importEmployeePreviewTable", () => {
  it("matches the reference preview table shell and actions", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeePreviewTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /importEmployeePreviewTableShellClass/);
    assert.match(source, /importEmployeePreviewHeadRowClass/);
    assert.match(source, /link-gray/);
    assert.match(source, /link-color/);
  });
});
