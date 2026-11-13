import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { policyMixChartData, policyMixSegments } from "./policyMixDonutData";

describe("policyMixDonutData", () => {
  it("keeps only slices with a count", () => {
    const segments = policyMixSegments(3, 0);
    assert.deepEqual(
      policyMixChartData(segments).map((segment) => segment.key),
      ["active"],
    );
  });

  it("labels inactive policies as Drafts", () => {
    const drafts = policyMixSegments(1, 2).find(
      (segment) => segment.key === "inactive",
    );
    assert.equal(drafts?.label, "Drafts");
  });

  it("uses a placeholder slice when both counts are zero", () => {
    const chart = policyMixChartData(policyMixSegments(0, 0));
    assert.equal(chart.length, 1);
    assert.equal(chart[0]?.key, "empty");
    assert.equal(chart[0]?.value, 1);
  });
});
