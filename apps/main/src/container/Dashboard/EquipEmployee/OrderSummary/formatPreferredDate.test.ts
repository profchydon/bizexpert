import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatPreferredDate,
  showPreferredDeliveryDate,
} from "./formatPreferredDate";

describe("formatPreferredDate", () => {
  it("formats a YYYY-MM-DD assign date without a timezone shift", () => {
    assert.equal(formatPreferredDate("2026-10-31"), "31 Oct 2026");
  });

  it("formats an ISO datetime using the calendar date only", () => {
    assert.equal(
      formatPreferredDate("2026-10-31T23:00:00.000Z"),
      "31 Oct 2026",
    );
  });

  it("returns null when the date is missing or not a calendar day", () => {
    assert.equal(formatPreferredDate(undefined), null);
    assert.equal(formatPreferredDate(null), null);
    assert.equal(formatPreferredDate(""), null);
    assert.equal(formatPreferredDate("soon"), null);
    assert.equal(formatPreferredDate("2026-02-31"), null);
  });
});

describe("showPreferredDeliveryDate", () => {
  it("shows the field for employee and office deliveries", () => {
    assert.equal(showPreferredDeliveryDate("employee"), true);
    assert.equal(showPreferredDeliveryDate("office"), true);
    assert.equal(showPreferredDeliveryDate(undefined), true);
  });

  it("hides the field for storage destinations", () => {
    assert.equal(showPreferredDeliveryDate("storage"), false);
  });
});
