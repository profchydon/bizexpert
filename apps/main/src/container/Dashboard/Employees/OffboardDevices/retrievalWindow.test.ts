import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRetrievalPresets,
  formatWindowLabel,
  fromISO,
  isStoredWindowValid,
  isWindowInFuture,
  isWindowValid,
  minRetrievalDate,
  toISO,
} from "./retrievalWindow";

const base = new Date("2026-06-05T10:30:00");

describe("minRetrievalDate", () => {
  it("returns the start of the day after the base date", () => {
    assert.equal(toISO(minRetrievalDate(base)), "2026-06-06");
  });
});

describe("buildRetrievalPresets", () => {
  it("builds future-oriented ranges from the base date", () => {
    const presets = buildRetrievalPresets(base);
    const byLabel = Object.fromEntries(
      presets.map((preset) => [
        preset.label,
        [toISO(preset.range.from), toISO(preset.range.to)],
      ]),
    );

    assert.deepEqual(byLabel["Next 7 days"], ["2026-06-06", "2026-06-12"]);
    assert.deepEqual(byLabel["Next 2 weeks"], ["2026-06-06", "2026-06-19"]);
    assert.deepEqual(byLabel["Next 30 days"], ["2026-06-06", "2026-07-05"]);
    assert.deepEqual(byLabel["Next month"], ["2026-07-01", "2026-07-31"]);
  });
});

describe("isWindowValid", () => {
  it("requires both dates", () => {
    assert.equal(isWindowValid(undefined, new Date()), false);
    assert.equal(isWindowValid(new Date(), undefined), false);
  });

  it("requires at least seven inclusive days", () => {
    assert.equal(
      isWindowValid(fromISO("2026-06-06"), fromISO("2026-06-11"), base),
      false,
    );
    assert.equal(
      isWindowValid(fromISO("2026-06-06"), fromISO("2026-06-12"), base),
      true,
    );
  });

  it("rejects windows starting today or earlier", () => {
    assert.equal(
      isWindowValid(fromISO("2026-06-05"), fromISO("2026-06-20"), base),
      false,
    );
    assert.equal(
      isWindowValid(fromISO("2026-05-01"), fromISO("2026-05-20"), base),
      false,
    );
  });
});

describe("isWindowInFuture", () => {
  it("accepts tomorrow and later", () => {
    assert.equal(isWindowInFuture(fromISO("2026-06-06"), base), true);
    assert.equal(isWindowInFuture(fromISO("2026-07-01"), base), true);
  });

  it("rejects today, past dates, and missing dates", () => {
    assert.equal(isWindowInFuture(fromISO("2026-06-05"), base), false);
    assert.equal(isWindowInFuture(fromISO("2026-06-04"), base), false);
    assert.equal(isWindowInFuture(undefined, base), false);
  });
});

describe("isStoredWindowValid", () => {
  it("rejects missing, past, and too-short stored windows", () => {
    assert.equal(isStoredWindowValid(undefined, base), false);
    assert.equal(
      isStoredWindowValid({ start: "2026-05-20", end: "2026-06-20" }, base),
      false,
    );
    assert.equal(
      isStoredWindowValid({ start: "2026-06-06", end: "2026-06-10" }, base),
      false,
    );
  });

  it("accepts a future window of at least seven days", () => {
    assert.equal(
      isStoredWindowValid({ start: "2026-06-06", end: "2026-06-12" }, base),
      true,
    );
  });
});

describe("formatWindowLabel", () => {
  it("returns an empty string when incomplete", () => {
    assert.equal(formatWindowLabel(undefined, undefined), "");
  });

  it("formats the inclusive range", () => {
    assert.equal(
      formatWindowLabel(fromISO("2026-07-01"), fromISO("2026-07-31")),
      "1 Jul 2026 – 31 Jul 2026",
    );
  });
});
