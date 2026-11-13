import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeEmployeeListResponse,
  resolveEmployeePaginateParam,
} from "./normalizeEmployeeListResponse";
import {
  hasCountryEmployees,
  isEmployeeInCountry,
  mapEmployeeOptions,
} from "@/container/Dashboard/EquipEmployee/AssignmentFlow/utils";
import { IEmployees } from "@/types/employees";

describe("resolveEmployeePaginateParam", () => {
  it("sends false as a string for unpaginated employee lists", () => {
    assert.equal(resolveEmployeePaginateParam(false), "false");
  });

  it("defaults to paginated requests", () => {
    assert.equal(resolveEmployeePaginateParam(), true);
    assert.equal(resolveEmployeePaginateParam(true), true);
  });
});

describe("normalizeEmployeeListResponse", () => {
  it("wraps unpaginated employee arrays in the paginated payload shape", () => {
    const employees = [{ id: "1", first_name: "Ada", last_name: "Lovelace" }];

    const normalized = normalizeEmployeeListResponse({
      data: employees as IEmployees[],
      message: "ok",
    });

    assert.deepEqual(normalized.data.data, employees);
    assert.equal(normalized.data.total, 1);
    assert.equal(normalized.data.last_page, 1);
  });
});

describe("assignment country matching", () => {
  const employees = mapEmployeeOptions([
    {
      id: "1",
      first_name: "Ada",
      last_name: "Lovelace",
      country: "Nigeria",
      country_code: "NG",
    } as IEmployees,
    {
      id: "2",
      first_name: "Grace",
      last_name: "Hopper",
      country: "Ghana",
      country_code: "GH",
    } as IEmployees,
  ]);

  it("matches employees by country name or code", () => {
    assert.equal(isEmployeeInCountry(employees[0], "Nigeria"), true);
    assert.equal(isEmployeeInCountry(employees[0], undefined, "NG"), true);
    assert.equal(hasCountryEmployees(employees, "Nigeria", "NG"), true);
    assert.equal(hasCountryEmployees(employees, "Kenya", "KE"), false);
  });

  it("handles nested country objects from the API", () => {
    const nestedEmployees = mapEmployeeOptions([
      {
        id: "3",
        first_name: "Test",
        last_name: "User",
        country: { name: "Nigeria", code: "NG" },
        country_code: { code: "NG" },
      } as unknown as IEmployees,
    ]);

    assert.equal(hasCountryEmployees(nestedEmployees, "Nigeria", "NG"), true);
  });
});
