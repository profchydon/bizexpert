import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_SYNC_MINUTES,
  MAX_SYNC_MINUTES,
  MIN_SYNC_MINUTES,
  isValidSyncMinutes,
  minutesToSeconds,
  secondsToMinutes,
} from "./agentConfig.logic";

describe("agent config sync interval helpers", () => {
  it("converts seconds to whole minutes", () => {
    assert.equal(secondsToMinutes(600), 10);
    assert.equal(secondsToMinutes(60), 1);
    assert.equal(secondsToMinutes(90), 2); // rounds to nearest minute
  });

  it("converts minutes to seconds", () => {
    assert.equal(minutesToSeconds(10), 600);
    assert.equal(minutesToSeconds(MAX_SYNC_MINUTES), 86400);
    assert.equal(minutesToSeconds(MIN_SYNC_MINUTES), 60);
  });

  it("round-trips the default without drift", () => {
    assert.equal(
      secondsToMinutes(minutesToSeconds(DEFAULT_SYNC_MINUTES)),
      DEFAULT_SYNC_MINUTES,
    );
  });

  it("accepts whole minutes within the allowed range", () => {
    assert.equal(isValidSyncMinutes(MIN_SYNC_MINUTES), true);
    assert.equal(isValidSyncMinutes(MAX_SYNC_MINUTES), true);
    assert.equal(isValidSyncMinutes(30), true);
  });

  it("rejects out-of-range, fractional, and non-finite values", () => {
    assert.equal(isValidSyncMinutes(0), false);
    assert.equal(isValidSyncMinutes(MAX_SYNC_MINUTES + 1), false);
    assert.equal(isValidSyncMinutes(2.5), false);
    assert.equal(isValidSyncMinutes(Number.NaN), false);
  });
});
