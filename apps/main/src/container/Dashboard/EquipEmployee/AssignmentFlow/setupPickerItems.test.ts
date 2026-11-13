import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { setupPickerItems, setupValueFromSelection } from "./setupPickerItems";

describe("setupPickerItems", () => {
  it("offers None so a selected config can be cleared", () => {
    assert.deepEqual(
      setupPickerItems([{ value: "ABM", label: "Apple Business Manager" }]),
      [
        { id: "none", label: "None" },
        { id: "ABM", label: "Apple Business Manager" },
      ],
    );
  });
});

describe("setupValueFromSelection", () => {
  it("keeps a config selection", () => {
    assert.equal(setupValueFromSelection("ABM"), "ABM");
    assert.equal(setupValueFromSelection("MI"), "MI");
  });

  it("clears the config when None is chosen", () => {
    assert.equal(setupValueFromSelection("none"), "");
    assert.equal(setupValueFromSelection(null), "");
  });
});
