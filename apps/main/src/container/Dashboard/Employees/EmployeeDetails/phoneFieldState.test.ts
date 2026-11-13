import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseEmployeePhone } from "@/utils/phone/parseEmployeePhone";
import {
  applyExternalPhone,
  createPhoneFieldState,
  editPhoneField,
  type PhoneFieldState,
} from "./phoneFieldState.ts";

function typeDigits(state: PhoneFieldState, country: string, digits: string) {
  let current = state;
  for (const char of digits) {
    const edited = editPhoneField(country, `${current.phone}${char}`);
    current = applyExternalPhone(edited, edited.output) ?? edited;
  }
  return current;
}

describe("phone field country edits", () => {
  it("keeps the selected country while a partial number echoes back", () => {
    const edited = editPhoneField("gb", "7");
    assert.equal(edited.output, "+447");
    assert.deepEqual(parseEmployeePhone("+447"), {
      country: "ng",
      phone: "447",
    });
    assert.equal(applyExternalPhone(edited, edited.output), null);
    assert.equal(edited.country, "gb");
    assert.equal(edited.phone, "7");
  });

  it("keeps the selected country after add, clear, and add again", () => {
    let state = typeDigits(createPhoneFieldState(""), "gb", "7911123456");
    assert.equal(state.country, "gb");
    assert.equal(state.phone, "7911123456");
    assert.equal(state.emitted, "+447911123456");

    const cleared = editPhoneField("gb", "");
    state = applyExternalPhone(cleared, cleared.output) ?? cleared;
    assert.equal(state.country, "gb");
    assert.equal(state.phone, "");

    state = typeDigits(state, "gb", "7700900123");
    assert.equal(state.country, "gb");
    assert.equal(state.phone, "7700900123");
    assert.equal(state.emitted, "+447700900123");
  });

  it("applies a phone number that came from outside the field", () => {
    const state = editPhoneField("gb", "7911123456");
    const external = applyExternalPhone(state, "+2348163456789");
    assert.deepEqual(external, {
      country: "ng",
      phone: "8163456789",
      emitted: "+2348163456789",
    });
  });
});
