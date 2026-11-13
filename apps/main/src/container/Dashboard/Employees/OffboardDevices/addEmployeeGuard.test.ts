import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { addEmployeeDisabledReason } from "./addEmployeeGuard";
import type { IEmployees } from "@/types/employees";

const employee = (overrides: Partial<IEmployees>): IEmployees =>
  ({
    id: "e-1",
    first_name: "Test",
    last_name: "User",
    country: "Angola",
    equipment_count: 0,
    ...overrides,
  }) as IEmployees;

describe("addEmployeeDisabledReason", () => {
  it("returns undefined when no requirements are set", () => {
    assert.equal(
      addEmployeeDisabledReason(employee({ country: undefined })),
      undefined,
    );
  });

  it("blocks employees without a country when requireCountry is set", () => {
    assert.equal(
      addEmployeeDisabledReason(employee({ country: undefined }), {
        requireCountry: true,
      }),
      "No country assigned",
    );
    assert.equal(
      addEmployeeDisabledReason(employee({ country: "   " }), {
        requireCountry: true,
      }),
      "No country assigned",
    );
  });

  it("allows employees with a country when requireCountry is set", () => {
    assert.equal(
      addEmployeeDisabledReason(employee({ country: "Poland" }), {
        requireCountry: true,
      }),
      undefined,
    );
  });

  it("allows employees with a nested country object when requireCountry is set", () => {
    assert.equal(
      addEmployeeDisabledReason(
        employee({
          country: {
            id: "pl",
            name: "Poland",
            code: "PL",
          } as never,
        }),
        { requireCountry: true },
      ),
      undefined,
    );
  });

  it("blocks employees without assigned devices when required", () => {
    assert.equal(
      addEmployeeDisabledReason(employee({ equipment_count: 0 }), {
        requireAssignedDevices: true,
      }),
      "No assigned devices",
    );
    assert.equal(
      addEmployeeDisabledReason(employee({ equipment_count: 3 }), {
        requireAssignedDevices: true,
      }),
      undefined,
    );
  });

  it("prioritises the assigned-devices reason over country", () => {
    assert.equal(
      addEmployeeDisabledReason(
        employee({ equipment_count: 0, country: undefined }),
        { requireAssignedDevices: true, requireCountry: true },
      ),
      "No assigned devices",
    );
  });
});
