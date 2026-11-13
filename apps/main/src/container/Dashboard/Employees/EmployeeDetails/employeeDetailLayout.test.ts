import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("employeeDetailClasses", () => {
  it("matches design-ui detail card shell tokens", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/employeeDetailClasses.ts",
      ),
      "utf8",
    );

    assert.match(
      source,
      /rounded-xl bg-primary shadow-xs ring-1 ring-secondary/,
    );
    assert.match(source, /border-b border-secondary/);
    assert.match(source, /text-tertiary/);
    assert.match(source, /lg:sticky lg:top-24/);
  });
});

describe("EmployeeProfileRail", () => {
  it("uses centered avatar and design-ui badges and buttons", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EmployeeProfileRail.tsx",
      ),
      "utf8",
    );

    assert.match(source, /-mt-12/);
    assert.match(source, /employeeDetailProfileRailClass/);
    assert.match(source, /BadgeWithDot/);
    assert.match(source, /components\/base\/buttons\/button/);
    assert.match(source, /Other details/);
    assert.match(source, /onOpenOtherDetails/);
  });
});

describe("Employee detail tables", () => {
  it("uses design-ui TableCard with disposition actions for equipment", () => {
    const equipment = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EquipmentSection/index.tsx",
      ),
      "utf8",
    );
    const equipmentTable = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/tables/EmployeeEquipmentTable.tsx",
      ),
      "utf8",
    );
    const ordersTable = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/tables/EmployeeOrdersTable.tsx",
      ),
      "utf8",
    );

    assert.match(equipment, /onBulkDisposition/);
    assert.match(equipmentTable, /selectionBehavior="toggle"/);
    assert.match(equipmentTable, /selectionMode="multiple"/);
    assert.match(equipmentTable, /EmployeeEquipmentSelectionBar/);
    assert.match(equipmentTable, /EmployeeEquipmentTableRow/);
    assert.match(equipmentTable, /EmployeeDetailTablePagination/);
    assert.match(ordersTable, /OrderStatusBadge/);
    assert.match(ordersTable, /EmployeeDetailTablePagination/);
  });
});

describe("Employee detail view actions", () => {
  it("exposes equip and off-board entries in the header dropdown", () => {
    const source = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EmployeeDetailViewActions.tsx",
      ),
      "utf8",
    );

    assert.match(source, /Equip employee/);
    assert.match(source, /Off-board employee/);
    assert.match(source, /Share invite/);
    assert.match(source, /Duplicate employee/);
    assert.match(source, /Delete employee/);
    assert.match(source, /useEquipEmployees/);
    assert.match(source, /useOffboardConfirm/);
  });
});
