import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeNoteIndex } from "./normalizeNoteIndex";

describe("normalizeNoteIndex", () => {
  it("returns zero-based index when in range", () => {
    assert.equal(normalizeNoteIndex("1", 3), 1);
  });

  it("accepts one-based note indexes from email links", () => {
    assert.equal(normalizeNoteIndex("2", 2), 1);
  });

  it("returns null for invalid values", () => {
    assert.equal(normalizeNoteIndex("abc", 2), null);
    assert.equal(normalizeNoteIndex("5", 2), null);
  });
});
