import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  employeeDetailPath,
  employeeDisplayName,
} from "./employeeAddedDialogUtils";
import type { IEmployees } from "@/types/employees";

describe("employee added dialog utils", () => {
  it("builds the created employee detail path", () => {
    assert.equal(
      employeeDetailPath("employee-1"),
      "/dashboard/employees/employee-1",
    );
    assert.equal(
      employeeDetailPath("employee-1", 2),
      "/dashboard/employees/employee-1?list_page=2",
    );
  });

  it("formats created employee display names with fallbacks", () => {
    assert.equal(
      employeeDisplayName({
        first_name: "Ada",
        last_name: "Lovelace",
        email: "ada@example.com",
      } as IEmployees),
      "Ada Lovelace",
    );

    assert.equal(
      employeeDisplayName({
        first_name: "",
        last_name: "",
        email: "employee@example.com",
      } as IEmployees),
      "employee@example.com",
    );
    assert.equal(employeeDisplayName(null), "employee");
  });
});
