import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  employeeMatchesCountry,
  filterEmployeesByCountry,
} from "./filterEmployeesByCountry";

describe("filterEmployeesByCountry", () => {
  it("matches employees by country name", () => {
    const employee = {
      id: "1",
      first_name: "State",
      last_name: "One",
      country: "United Kingdom",
    };

    assert.equal(employeeMatchesCountry(employee, "United Kingdom"), true);
    assert.equal(employeeMatchesCountry(employee, "Nigeria"), false);
  });

  it("matches employees by nested country name or code", () => {
    const employee = {
      id: "1",
      first_name: "State",
      last_name: "One",
      country: {
        id: "gb",
        name: "United Kingdom",
        code: "GB",
        currency_code: "GBP",
      },
    } as never;

    assert.equal(employeeMatchesCountry(employee, "United Kingdom"), true);
    assert.equal(employeeMatchesCountry(employee, "GB"), true);
    assert.equal(employeeMatchesCountry(employee, "Nigeria"), false);
  });

  it("returns all employees when no country is selected", () => {
    const employees = [
      { id: "1", country: "United Kingdom" },
      { id: "2", country: "Nigeria" },
    ];

    assert.deepEqual(filterEmployeesByCountry(employees, null), employees);
  });

  it("filters employees to the selected country", () => {
    const employees = [
      { id: "1", country: "United Kingdom" },
      { id: "2", country: "Nigeria" },
    ];

    assert.deepEqual(filterEmployeesByCountry(employees, "United Kingdom"), [
      { id: "1", country: "United Kingdom" },
    ]);
  });
});
