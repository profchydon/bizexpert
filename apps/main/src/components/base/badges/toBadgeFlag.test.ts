import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { toBadgeFlag } from "./toBadgeFlag";

describe("toBadgeFlag", () => {
  it("uppercases a country code for BadgeWithFlag", () => {
    assert.equal(toBadgeFlag("ng"), "NG");
    assert.equal(toBadgeFlag("US"), "US");
  });

  it("returns undefined when no code is given", () => {
    assert.equal(toBadgeFlag(), undefined);
    assert.equal(toBadgeFlag(""), undefined);
  });
});
