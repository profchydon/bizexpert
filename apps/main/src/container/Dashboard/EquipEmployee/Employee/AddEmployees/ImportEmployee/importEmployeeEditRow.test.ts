import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

describe("ImportEmployeeEditRow", () => {
  it("matches the reference import edit shell and form modules", () => {
    const row = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeEditRow.tsx",
      ),
      "utf8",
    );
    const identity = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeEditIdentityFields.tsx",
      ),
      "utf8",
    );
    const role = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeEditRoleFields.tsx",
      ),
      "utf8",
    );
    const index = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/index.tsx",
      ),
      "utf8",
    );

    assert.match(row, /color="link-gray"/);
    assert.match(row, /ImportEmployeeEditForm/);
    assert.match(row, /addEmployeesFooterBorderClass/);
    assert.match(identity, /Personal email \(Optional\)/);
    assert.match(identity, /National ID\/Tax Number \(Optional\)/);
    const levelField = readFileSync(
      join(
        process.cwd(),
        "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeCreatableFields.tsx",
      ),
      "utf8",
    );

    assert.match(role, /EditEmployeeLineManagerField/);
    assert.match(levelField, /Select or create level/);
    assert.match(index, /ImportEmployeeEditRow/);
    assert.doesNotMatch(index, /EditEmployee\/index/);
  });
});
