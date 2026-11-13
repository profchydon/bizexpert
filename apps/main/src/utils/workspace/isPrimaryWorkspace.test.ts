import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isPrimaryWorkspace } from "./isPrimaryWorkspace";

const primary = { id: "company-primary", is_primary: true };
const nigeria = {
  id: "01a01973-c039-71cf-8290-2aeed95faa66",
  is_primary: false,
};

describe("isPrimaryWorkspace", () => {
  it("treats the global workspace as Primary", () => {
    assert.equal(isPrimaryWorkspace([primary, nigeria], null), true);
  });

  it("treats the primary entity workspace as Primary", () => {
    assert.equal(isPrimaryWorkspace([primary, nigeria], primary.id), true);
  });

  it("is not Primary after switching to a subsidiary", () => {
    assert.equal(isPrimaryWorkspace([primary, nigeria], nigeria.id), false);
  });
});
