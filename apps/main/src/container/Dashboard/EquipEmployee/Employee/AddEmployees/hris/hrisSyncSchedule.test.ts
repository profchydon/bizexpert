import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatNextSyncIn,
  getSyncFrequencyMs,
  parseIntegrationDateTime,
} from "./hrisSyncSchedule";

const aug152026 = new Date("2026-08-15T00:32:00.000Z");

describe("parseIntegrationDateTime", () => {
  it("parses API datetime strings with a space separator", () => {
    const date = parseIntegrationDateTime("2026-08-07 15:31:51");
    assert.ok(date);
    assert.equal(date.getFullYear(), 2026);
    assert.equal(date.getMonth(), 7);
    assert.equal(date.getDate(), 7);
  });
});

describe("getSyncFrequencyMs", () => {
  it("maps bi-weekly sync frequency to 14 days", () => {
    assert.equal(getSyncFrequencyMs("Bi-weekly"), 14 * 24 * 60 * 60 * 1000);
  });
});

describe("formatNextSyncIn", () => {
  it("shows due now when the next sync time has passed", () => {
    assert.equal(
      formatNextSyncIn("2026-02-26 17:14:11", "Bi-weekly", aug152026),
      "Due now",
    );
  });

  it("shows the relative time until the next bi-weekly sync", () => {
    assert.equal(
      formatNextSyncIn("2026-08-07 15:31:51", "Bi-weekly", aug152026),
      "7 days",
    );
  });

  it("returns not scheduled when sync metadata is missing", () => {
    assert.equal(
      formatNextSyncIn(undefined, "Bi-weekly", aug152026),
      "Not scheduled",
    );
    assert.equal(
      formatNextSyncIn("2026-08-07 15:31:51", undefined, aug152026),
      "Not scheduled",
    );
    assert.equal(
      formatNextSyncIn("invalid-date", "Bi-weekly", aug152026),
      "Not scheduled",
    );
  });

  it("handles other supported sync frequencies", () => {
    const lastSync = "2026-08-14 12:00:00";
    assert.equal(formatNextSyncIn(lastSync, "Daily", aug152026), "11 hours");
    assert.equal(formatNextSyncIn(lastSync, "Weekly", aug152026), "7 days");
    assert.equal(formatNextSyncIn(lastSync, "Monthly", aug152026), "30 days");
  });
});
