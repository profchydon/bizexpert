import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";
import {
  departmentTabTriggerClass,
  departmentTableToolbarSectionClass,
  departmentTabsListClass,
} from "./departmentPageClasses";

describe("departmentPageClasses", () => {
  it("exports full-bleed tab and toolbar classes", () => {
    assert.match(departmentTabsListClass, /before:inset-x-0 before:bottom-0/);
    assert.match(departmentTabTriggerClass, /data-\[state=active\]:border-b-2/);
    assert.match(
      departmentTableToolbarSectionClass,
      /border-b border-border-secondary/,
    );
  });
});

describe("Department page dividers", () => {
  it("uses full-bleed tab list and toolbar borders", () => {
    const page = readFileSync(
      join(process.cwd(), "src/container/Dashboard/Department/index.tsx"),
      "utf8",
    );
    const departmentTable = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Department/DepartmentTable/index.tsx",
      ),
      "utf8",
    );

    assert.match(page, /departmentTabsListClass/);
    assert.match(page, /departmentTabTriggerClass/);
    assert.doesNotMatch(page, /border-b gap-y-6/);
    assert.match(departmentTable, /departmentTableToolbarSectionClass/);
    assert.doesNotMatch(departmentTable, /CardHeader/);
  });
});
