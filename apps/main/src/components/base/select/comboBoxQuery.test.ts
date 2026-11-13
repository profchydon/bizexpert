import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldResetComboBoxQueryOnOpen } from "./comboBoxQuery.ts";

describe("shouldResetComboBoxQueryOnOpen", () => {
  it("clears a closed field so the full list can show", () => {
    assert.equal(shouldResetComboBoxQueryOnOpen("", ""), true);
    assert.equal(shouldResetComboBoxQueryOnOpen("Senior", "Senior"), true);
  });

  it("keeps a name the user is typing so create can stay available", () => {
    assert.equal(shouldResetComboBoxQueryOnOpen("Senior", ""), false);
  });
});
