import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hasReviewedSelectionLimits,
  markSelectionLimitsReviewed,
  removeSelectionLimitsReviewParam,
  selectionLimitReviewKey,
} from "./selectionLimitReviewStorage";

function createStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("selection limit review storage", () => {
  it("builds a scoped review key for a company and catalog", () => {
    assert.equal(
      selectionLimitReviewKey("company-1", "catalog-1"),
      "catalog-policy-selection-limits-reviewed:company-1:catalog-1",
    );
    assert.equal(selectionLimitReviewKey("company-1"), null);
  });

  it("marks and reads dismissed review modals", () => {
    const storage = createStorage();
    const key = selectionLimitReviewKey("company-1", "catalog-1");

    assert.equal(hasReviewedSelectionLimits(key, storage), false);
    markSelectionLimitsReviewed(key, storage);
    assert.equal(hasReviewedSelectionLimits(key, storage), true);
  });

  it("removes the review query param while preserving other params", () => {
    assert.equal(
      removeSelectionLimitsReviewParam(
        "/dashboard/catalog-policies/rules/policy-1",
        "reviewSelectionLimits=1&openSubRules=1",
      ),
      "/dashboard/catalog-policies/rules/policy-1?openSubRules=1",
    );

    assert.equal(
      removeSelectionLimitsReviewParam(
        "/dashboard/catalog-policies/rules/policy-1",
        "reviewSelectionLimits=1",
      ),
      "/dashboard/catalog-policies/rules/policy-1",
    );
  });
});
