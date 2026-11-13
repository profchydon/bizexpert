import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  wizardFieldTriggerClass,
  wizardLabelClass,
  wizardRadioItemClass,
} from "./wizardFieldClasses";

describe("wizardFieldClasses", () => {
  it("matches select-style trigger sizing for wizard fields", () => {
    assert.match(wizardFieldTriggerClass, /h-\[44px\]/);
    assert.match(wizardFieldTriggerClass, /rounded-lg/);
    assert.match(wizardFieldTriggerClass, /text-base/);
  });

  it("styles radio items with primary checked colors", () => {
    assert.match(wizardRadioItemClass, /text-primary-700/);
    assert.match(
      wizardRadioItemClass,
      /data-\[state=checked\]:border-primary-700/,
    );
  });

  it("uses consistent label typography", () => {
    assert.match(wizardLabelClass, /text-sm font-medium/);
  });
});
