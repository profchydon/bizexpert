import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { IEmployees } from "@/types/employees";
import {
  duplicatedEmployeeRedirectPath,
  duplicateEmployeeFormValues,
  duplicateEmployeeSearch,
} from "./duplicateEmployee";

const employee = {
  first_name: "Ginger",
  last_name: "Eleven",
  email: "ginger11@yopmail.com",
  personal_email: "ginger.personal@yopmail.com",
  phone: "+2348012345678",
  tax_number: "TIN-11",
  level_position: { id: "level-1", name: "Level One" },
  department_id: "department-1",
  job_title: "QA Engineer",
  line_manager: {
    id: "manager-1",
    first_name: "Ada",
    last_name: "Lovelace",
  },
  employment_type: "Full_Time",
  country: "Nigeria",
  address: "11 Test Street",
  landmark: "Near the park",
} as IEmployees;

describe("duplicate employee helpers", () => {
  it("maps employee details into add-employee form values", () => {
    assert.deepEqual(duplicateEmployeeFormValues(employee), {
      first_name: "Ginger",
      last_name: "Eleven",
      email: "ginger11@yopmail.com",
      personal_email: "ginger.personal@yopmail.com",
      phone: "+2348012345678",
      tax_number: "TIN-11",
      level: "level-1",
      department_id: "department-1",
      job_title: "QA Engineer",
      manager_id: "manager-1",
      employment_type: "Full_Time",
      country_id: "Nigeria",
      address: "11 Test Street",
      landmark: "Near the park",
    });
  });

  it("serializes only present duplicate form values", () => {
    const search = duplicateEmployeeSearch({
      first_name: "Ginger",
      last_name: "Eleven",
      email: "",
      personal_email: null,
      country: "Nigeria",
      department_id: "department-1",
    } as IEmployees);

    assert.equal(search.includes("first_name=Ginger"), true);
    assert.equal(search.includes("email="), false);
    assert.equal(search.includes("personal_email="), false);
    assert.equal(search.includes("country_id=Nigeria"), true);
  });

  it("adds the line manager name for duplicate select display", () => {
    const search = duplicateEmployeeSearch(employee);

    assert.equal(search.includes("manager_id=manager-1"), true);
    assert.equal(search.includes("manager_name=Ada+Lovelace"), true);
  });

  it("adds the level name for duplicate select resolution", () => {
    const search = duplicateEmployeeSearch(employee);

    assert.equal(search.includes("level=level-1"), true);
    assert.equal(search.includes("level_name=Level+One"), true);
  });

  it("builds the duplicated employee detail redirect path", () => {
    assert.equal(
      duplicatedEmployeeRedirectPath({ id: "employee-2" }),
      "/dashboard/employees/employee-2",
    );
    assert.equal(duplicatedEmployeeRedirectPath(null), null);
  });
});
