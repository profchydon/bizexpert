import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatEmployeePhone,
  normalizeEmployeePhoneValue,
  parseEmployeePhone,
} from "./parseEmployeePhone.ts";

describe("parseEmployeePhone", () => {
  it("splits an international phone number into country and national digits", () => {
    const parsed = parseEmployeePhone("+2348163456789");
    assert.equal(parsed.country, "ng");
    assert.equal(parsed.phone, "8163456789");
  });

  it("formats country and national digits back to E.164", () => {
    assert.equal(formatEmployeePhone("ng", "8163456789"), "+2348163456789");
  });

  it("strips a duplicated dial code from the national digits", () => {
    assert.equal(formatEmployeePhone("ng", "2348140504040"), "+2348140504040");
  });

  it("strips a leading zero from the national digits", () => {
    assert.equal(formatEmployeePhone("ng", "08163456789"), "+2348163456789");
  });

  it("normalizes a stored phone value with a duplicated dial code", () => {
    assert.equal(
      normalizeEmployeePhoneValue("+2342348140504040"),
      "+2348140504040",
    );
  });
});
