import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  officeModalCancelButtonClass,
  officeModalErrorHintClass,
  officeModalFieldHintClass,
  officeModalFooterButtonClass,
  officeModalSearchIconClass,
  officeModalSearchInputClass,
  officeModalSelectTriggerClass,
  officeModalTextInputClass,
} from "./officeModalFieldClasses";

describe("officeModalFieldClasses", () => {
  it("matches the reference md search input sizing", () => {
    assert.match(officeModalSearchInputClass, /rounded-lg/);
    assert.match(officeModalSearchInputClass, /px-3\.5/);
    assert.match(officeModalSearchInputClass, /pl-\[42px\]/);
    assert.match(officeModalSearchInputClass, /text-base/);
  });

  it("uses a 20px search icon aligned to the md field padding", () => {
    assert.match(officeModalSearchIconClass, /size-5/);
    assert.match(officeModalSearchIconClass, /left-3\.5/);
    assert.match(officeModalSearchIconClass, /text-gray-400/);
  });

  it("matches the reference hint text", () => {
    assert.match(officeModalFieldHintClass, /text-sm/);
    assert.match(officeModalFieldHintClass, /text-gray-600/);
    assert.doesNotMatch(officeModalFieldHintClass, /text-xs/);
  });

  it("matches the reference md text input and error hint", () => {
    assert.match(officeModalTextInputClass, /rounded-lg/);
    assert.match(officeModalTextInputClass, /px-3\.5/);
    assert.match(officeModalTextInputClass, /text-base/);
    assert.match(officeModalErrorHintClass, /text-sm/);
    assert.match(officeModalErrorHintClass, /text-error-600/);
  });

  it("matches the reference 40px md footer button", () => {
    assert.match(officeModalFooterButtonClass, /h-10/);
    assert.match(officeModalFooterButtonClass, /w-full/);
    assert.match(officeModalFooterButtonClass, /rounded-lg/);
    assert.match(officeModalFooterButtonClass, /px-3\.5/);
    assert.match(officeModalFooterButtonClass, /text-sm/);
    assert.match(officeModalFooterButtonClass, /font-semibold/);
  });

  it("matches the reference secondary cancel button", () => {
    assert.match(officeModalCancelButtonClass, /h-10/);
    assert.match(officeModalCancelButtonClass, /w-full/);
    assert.match(officeModalCancelButtonClass, /border-gray-300/);
    assert.match(officeModalCancelButtonClass, /font-semibold/);
    assert.match(officeModalCancelButtonClass, /text-gray-700/);
  });

  it("gives the office area select the md field padding", () => {
    assert.match(officeModalSelectTriggerClass, /rounded-lg/);
    assert.match(officeModalSelectTriggerClass, /px-3\.5/);
  });
});
