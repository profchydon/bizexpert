import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldCloseDatePicker } from "./datePickerSelection";

describe("shouldCloseDatePicker", () => {
  it("closes after a selectable day is chosen", () => {
    assert.equal(shouldCloseDatePicker(new Date(2026, 9, 29), false), true);
  });

  it("stays open when the day is blocked or missing", () => {
    assert.equal(shouldCloseDatePicker(new Date(2026, 9, 14), true), false);
    assert.equal(shouldCloseDatePicker(undefined, false), false);
  });
});
