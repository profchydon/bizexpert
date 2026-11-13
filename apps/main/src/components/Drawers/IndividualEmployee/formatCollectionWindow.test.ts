import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatCollectionWindow } from "./formatCollectionWindow";

describe("formatCollectionWindow", () => {
  it("returns null when there is no sub-order", () => {
    assert.equal(formatCollectionWindow(undefined), null);
    assert.equal(formatCollectionWindow(null), null);
  });

  it("formats a start/end window as a range", () => {
    assert.equal(
      formatCollectionWindow({
        collection_date_start: "2026-06-15",
        collection_date_end: "2026-06-21",
      }),
      "Jun 15, 2026 - Jun 21, 2026",
    );
  });

  it("collapses a single-day window to one date", () => {
    assert.equal(
      formatCollectionWindow({
        collection_date_start: "2026-06-15",
        collection_date_end: "2026-06-15",
      }),
      "Jun 15, 2026",
    );
  });

  it("uses only the start when end is missing", () => {
    assert.equal(
      formatCollectionWindow({ collection_date_start: "2026-06-15" }),
      "Jun 15, 2026",
    );
  });

  it("falls back to the legacy collection_date", () => {
    assert.equal(
      formatCollectionWindow({ collection_date: "2026-06-15" }),
      "Jun 15, 2026",
    );
  });

  it("prefers the window over the legacy field", () => {
    assert.equal(
      formatCollectionWindow({
        collection_date: "2026-01-01",
        collection_date_start: "2026-06-15",
        collection_date_end: "2026-06-20",
      }),
      "Jun 15, 2026 - Jun 20, 2026",
    );
  });

  it("returns null when every date is missing or invalid", () => {
    assert.equal(
      formatCollectionWindow({
        collection_date_start: null,
        collection_date_end: "",
        collection_date: "not-a-date",
      }),
      null,
    );
  });
});
