import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatGradeBadgeLabel } from "./formatGradeBadgeLabel";

describe("formatGradeBadgeLabel", () => {
  it("uses the API label when present", () => {
    assert.equal(formatGradeBadgeLabel("B", "Good"), "B · Good");
  });

  it("shows only the letter when the API omits a label", () => {
    assert.equal(formatGradeBadgeLabel("D", "  "), "D");
  });
});
