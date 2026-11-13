import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { employeeOptionLabel, employeesToOptions } from "./employeeOptions";

describe("employee option helpers", () => {
  it("maps employees to searchable line manager options", () => {
    assert.deepEqual(
      employeesToOptions([
        {
          id: "employee-1",
          first_name: "Ada",
          last_name: "Lovelace",
          email: "ada@example.com",
        },
        {
          id: "employee-2",
          first_name: "Grace",
          last_name: "Hopper",
          email: "grace@example.com",
        },
      ]),
      [
        { value: "employee-1", label: "Ada Lovelace" },
        { value: "employee-2", label: "Grace Hopper" },
      ],
    );
  });

  it("excludes the current employee from line manager options", () => {
    assert.deepEqual(
      employeesToOptions(
        [
          { id: "employee-1", first_name: "Ada", last_name: "Lovelace" },
          { id: "employee-2", first_name: "Grace", last_name: "Hopper" },
        ],
        "employee-1",
      ),
      [{ value: "employee-2", label: "Grace Hopper" }],
    );
  });

  it("falls back to email when an employee name is missing", () => {
    assert.equal(
      employeeOptionLabel({ email: "manager@example.com" }),
      "manager@example.com",
    );
  });
});
