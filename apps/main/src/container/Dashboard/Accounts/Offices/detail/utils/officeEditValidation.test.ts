import assert from "node:assert/strict";
import { test } from "node:test";
import { getOfficeEditValidation } from "./officeEditValidation";

test("valid physical office draft can save", () => {
  const result = getOfficeEditValidation({
    name: "London HQ",
    physical: true,
    address: "10 Example Road",
  });
  assert.equal(result.canSave, true);
  assert.equal(result.nameInvalid, false);
  assert.equal(result.addressInvalid, false);
});

test("empty name blocks saving", () => {
  const result = getOfficeEditValidation({
    name: "   ",
    physical: false,
    address: "",
  });
  assert.equal(result.nameInvalid, true);
  assert.equal(result.canSave, false);
});

test("physical office requires an address", () => {
  const result = getOfficeEditValidation({
    name: "London HQ",
    physical: true,
    address: "  ",
  });
  assert.equal(result.addressInvalid, true);
  assert.equal(result.canSave, false);
});

test("remote office does not require an address", () => {
  const result = getOfficeEditValidation({
    name: "Remote Hub",
    physical: false,
    address: "",
  });
  assert.equal(result.addressInvalid, false);
  assert.equal(result.canSave, true);
});
