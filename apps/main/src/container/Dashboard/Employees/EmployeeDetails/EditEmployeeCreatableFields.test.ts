import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const fields = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeCreatableFields.tsx",
  ),
  "utf8",
);
const role = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeRoleFields.tsx",
  ),
  "utf8",
);
const importRole = readFileSync(
  join(
    process.cwd(),
    "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/ImportEmployee/ImportEmployeeEditRoleFields.tsx",
  ),
  "utf8",
);

describe("EditEmployeeCreatableFields", () => {
  it("restores create-and-select for Level and Department", () => {
    assert.match(fields, /useCreateLevelMutation/);
    assert.match(fields, /useCreateDepartmentMutation/);
    assert.match(fields, /Select or create level/);
    assert.match(fields, /Select or create department/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/CreatableNamedComboBox.tsx",
        ),
        "utf8",
      ),
      /defaultFilter=\{\(\) => true\}/,
    );
    assert.match(role, /EditEmployeeLevelField/);
    assert.match(role, /EditEmployeeDepartmentField/);
    assert.match(importRole, /EditEmployeeLevelField/);
    assert.match(importRole, /EditEmployeeDepartmentField/);
    assert.match(
      readFileSync(
        join(
          process.cwd(),
          "src/container/Dashboard/Employees/EmployeeDetails/CreatableNamedComboBox.tsx",
        ),
        "utf8",
      ),
      /mergeCreatedSelectOption/,
    );
  });
});
