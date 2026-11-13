import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { join } from "node:path";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("add employee required fields", () => {
  it("marks first name, last name, and work email as required", () => {
    const identity = read(
      "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeIdentityFields.tsx",
    );

    assert.match(identity, /label="First name"\s+isRequired/);
    assert.match(identity, /label="Last name"\s+isRequired/);
    assert.match(identity, /label="Work email"\s+isRequired/);
    assert.doesNotMatch(identity, /label="Personal email"\s+isRequired/);
    assert.doesNotMatch(identity, /label="Job title"\s+isRequired/);
  });

  it("marks country as required only on the add employee form", () => {
    const addTab = read(
      "src/container/Dashboard/EquipEmployee/Employee/AddEmployees/AddEmployeeSlideoutTab.tsx",
    );
    const form = read(
      "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeForm.tsx",
    );
    const role = read(
      "src/container/Dashboard/Employees/EmployeeDetails/EditEmployeeRoleFields.tsx",
    );
    const editProfile = read(
      "src/container/Dashboard/Employees/EmployeeDetails/EditProfileSlideout.tsx",
    );

    assert.match(addTab, /countryRequired/);
    assert.match(form, /countryRequired=\{countryRequired\}/);
    assert.match(role, /isRequired=\{countryRequired\}/);
    assert.doesNotMatch(editProfile, /countryRequired/);
  });
});
