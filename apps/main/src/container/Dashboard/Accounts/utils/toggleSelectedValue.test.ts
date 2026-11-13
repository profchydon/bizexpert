import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { toggleSelectedValue } from "./toggleSelectedValue";

describe("toggleSelectedValue", () => {
  it("adds and removes values from a selection list", () => {
    assert.deepEqual(toggleSelectedValue([], "operational"), ["operational"]);
    assert.deepEqual(toggleSelectedValue(["operational"], "operational"), []);
  });
});
