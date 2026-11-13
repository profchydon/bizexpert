import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildEditEmployeeFormData } from "@/container/Dashboard/Employees/EmployeeDetails/buildEditEmployeeFormData";
import { addEmployeeSchema } from "./AddEmployee/validation";
import {
  canSaveAddEmployee,
  getAddEmployeeSaveDisabledReason,
} from "./addEmployeeCanSave";

const baseValues = {
  ...buildEditEmployeeFormData(),
  first_name: "John",
  last_name: "Doe",
  email: "john@company.com",
  country_id: "United States",
};

describe("addEmployeeSchema", () => {
  it("accepts empty optional phone and address fields", () => {
    const result = addEmployeeSchema.safeParse(baseValues);
    assert.equal(result.success, true);
  });

  it("rejects invalid phone numbers when provided", () => {
    const result = addEmployeeSchema.safeParse({
      ...baseValues,
      phone: "123",
    });
    assert.equal(result.success, false);
  });
});

describe("canSaveAddEmployee", () => {
  it("returns false without a company id", () => {
    assert.equal(canSaveAddEmployee(baseValues, undefined), false);
  });

  it("returns false when required fields are missing", () => {
    assert.equal(
      canSaveAddEmployee({ ...baseValues, country_id: "" }, "company-1"),
      false,
    );
  });

  it("returns true when required fields and company id are present", () => {
    assert.equal(canSaveAddEmployee(baseValues, "company-1"), true);
  });

  it("accepts a phone value with a duplicated dial code after normalization", () => {
    assert.equal(
      canSaveAddEmployee(
        { ...baseValues, phone: "+2342348140504040" },
        "company-1",
      ),
      true,
    );
  });
});

describe("getAddEmployeeSaveDisabledReason", () => {
  it("returns null when the form can be saved", () => {
    assert.equal(
      getAddEmployeeSaveDisabledReason(baseValues, "company-1"),
      null,
    );
  });

  it("returns a reason when first name is missing", () => {
    assert.equal(
      getAddEmployeeSaveDisabledReason(
        { ...baseValues, first_name: "" },
        "company-1",
      ),
      "Enter a first name with at least 2 characters.",
    );
  });

  it("returns a reason when company id is missing", () => {
    assert.equal(
      getAddEmployeeSaveDisabledReason(baseValues, undefined),
      "Company workspace is not available. Refresh and try again.",
    );
  });

  it("returns a reason for an invalid phone number", () => {
    assert.equal(
      getAddEmployeeSaveDisabledReason(
        { ...baseValues, phone: "123" },
        "company-1",
      ),
      "Enter a valid phone number.",
    );
  });
});
