import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("EmployeeRowActions navigation loading", () => {
  it("shows per-action spinners for view, equip, and off-board routes", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeesTable/EmployeeRowActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /isEquipLoading/);
    assert.match(source, /isOffboardLoading/);
    assert.match(source, /isViewLoading/);
    assert.match(source, /onAction=\{\(\) => view\(viewHref\)\}/);
    assert.doesNotMatch(source, /replace:\s*true/);
  });
});

describe("EmployeesTableRow name link", () => {
  it("links the employee name to the detail page", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeesTable/EmployeesTableRow.tsx",
      ),
      "utf8",
    );

    assert.match(source, /import Link from "next\/link"/);
    assert.match(
      source,
      /<Link\s+href=\{viewHref\}[^>]*>\s*\{fullName\}\s*<\/Link>/,
    );
    assert.match(source, /<EmployeeRowActions\s+viewHref=\{viewHref\}/);
  });
});

describe("Employee detail route loading", () => {
  it("shows RouteLoading while the detail segment loads", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/app/dashboard/employees/[employeeId]/loading.tsx",
      ),
      "utf8",
    );

    assert.match(source, /RouteLoading/);
  });
});

describe("Employee detail off-board navigation", () => {
  it("shows button loading while routing to off-board devices", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EmployeeProfileRail.tsx",
      ),
      "utf8",
    );

    assert.match(source, /isOffboardPending/);
    assert.match(source, /isLoading=\{isOffboardPending\}/);
  });
});

describe("useEquipEmployees row loading", () => {
  it("scopes pending state to the clicked employee row", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeesTable/useEquipEmployees.ts",
      ),
      "utf8",
    );

    assert.match(source, /activeEmployeeId/);
    assert.match(source, /isRowLoading/);
  });
});

describe("useOffboardConfirm row loading", () => {
  it("scopes pending state to the clicked employee row", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeesTable/useOffboardConfirm.ts",
      ),
      "utf8",
    );

    assert.match(source, /activeEmployeeId/);
    assert.match(source, /isRowLoading/);
  });
});
