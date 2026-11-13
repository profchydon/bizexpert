import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizeBoundedLimitInputValue,
  normalizeLimitInputValue,
  normalizeSelectionLimitRange,
  normalizeSelectionLimitMaxValues,
} from "./selectionLimitInputUtils";

describe("selection limit input utils", () => {
  it("defaults max input values below one to one", () => {
    assert.equal(normalizeLimitInputValue("0", 1), 1);
    assert.equal(normalizeLimitInputValue("", 1), 1);
    assert.equal(normalizeLimitInputValue("5", 1), 5);
  });

  it("keeps min input values able to use zero", () => {
    assert.equal(normalizeLimitInputValue("0", 0), 0);
  });

  it("caps bounded min input values at max", () => {
    assert.equal(normalizeBoundedLimitInputValue("12", 0, 1), 1);
    assert.equal(normalizeBoundedLimitInputValue("2", 0, 5), 2);
  });

  it("resets min to max when min is greater than max", () => {
    assert.deepEqual(
      normalizeSelectionLimitRange({ category: "Imac", min: 10, max: 1 }),
      { category: "Imac", min: 1, max: 1 },
    );
  });

  it("normalizes saved max values without changing no-limit rows", () => {
    assert.deepEqual(
      normalizeSelectionLimitMaxValues([
        { category: "Laptop", min: 0, max: 0 },
        { category: "Phone", min: 0, max: null },
      ]),
      [
        { category: "Laptop", min: 0, max: 1 },
        { category: "Phone", min: 0, max: null },
      ],
    );
  });

  it("keeps no-limit rows unbounded when saving", () => {
    assert.deepEqual(
      normalizeSelectionLimitMaxValues([
        { category: "Phone", min: 2, max: null },
      ]),
      [{ category: "Phone", min: 2, max: null }],
    );
  });

  it("resets min to max when saved max is lower than min", () => {
    assert.deepEqual(
      normalizeSelectionLimitMaxValues([
        { category: "Laptop", min: 3, max: 2 },
      ]),
      [{ category: "Laptop", min: 2, max: 2 }],
    );
  });
});
