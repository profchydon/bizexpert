import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  nextPhoneAfterExampleEdit,
  phoneExampleValue,
} from "./phoneExampleEdit.ts";

const example = phoneExampleValue("+234");

describe("phone example edit", () => {
  it("shows the dial code with the example national number", () => {
    assert.equal(example, "+234 (555) 000-0000");
  });

  it("keeps the example when the field has not changed", () => {
    assert.deepEqual(nextPhoneAfterExampleEdit(example, example), {
      phone: "",
      dismissed: false,
    });
  });

  it("clears the default when the example is deleted", () => {
    assert.deepEqual(nextPhoneAfterExampleEdit("", example), {
      phone: "",
      dismissed: true,
    });
  });

  it("clears the default when part of the example is deleted", () => {
    assert.deepEqual(nextPhoneAfterExampleEdit("+234 (555) 000-000", example), {
      phone: "",
      dismissed: true,
    });
  });

  it("replaces the default when a number is typed over it", () => {
    assert.deepEqual(nextPhoneAfterExampleEdit("8012345678", example), {
      phone: "8012345678",
      dismissed: true,
    });
  });

  it("keeps only digits typed after the example", () => {
    assert.deepEqual(nextPhoneAfterExampleEdit(`${example}8`, example), {
      phone: "8",
      dismissed: true,
    });
  });
});
