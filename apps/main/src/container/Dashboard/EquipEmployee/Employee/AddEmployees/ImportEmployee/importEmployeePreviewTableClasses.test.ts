import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  importEmployeePreviewBodyRowClass,
  importEmployeePreviewHeadRowClass,
  importEmployeePreviewTableShellClass,
} from "./importEmployeePreviewTableClasses";

describe("importEmployeePreviewTableClasses", () => {
  it("uses design-ui border tokens for table dividers", () => {
    assert.match(
      importEmployeePreviewTableShellClass,
      /border-border-secondary/,
    );
    assert.match(importEmployeePreviewHeadRowClass, /bg-border-secondary/);
    assert.match(importEmployeePreviewBodyRowClass, /bg-border-secondary/);
    assert.doesNotMatch(
      importEmployeePreviewHeadRowClass,
      /\bborder-b border-secondary\b/,
    );
  });

  it("is wired into the import preview table component", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeePreviewTable.tsx",
      ),
      "utf8",
    );

    assert.match(source, /importEmployeePreviewTableShellClass/);
    assert.match(source, /importEmployeePreviewHeadRowClass/);
    assert.match(source, /importEmployeePreviewBodyRowClass/);
    assert.doesNotMatch(source, /border-b border-secondary/);
  });
});
