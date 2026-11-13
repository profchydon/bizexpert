import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { NIGERIA_HOLIDAYS_2026 } from "../data/nigeriaHolidays";
import { getUpcomingHoliday, parseDeliveryRange } from "./deliveryHolidayUtils";

describe("parseDeliveryRange", () => {
  it("parses a day range", () => {
    assert.deepEqual(parseDeliveryRange("5-7 business days"), {
      min: 5,
      max: 7,
    });
  });

  it("parses a single day value", () => {
    assert.deepEqual(parseDeliveryRange("10 days"), { min: 10, max: 10 });
  });

  it("falls back to 7 days when no numbers are present", () => {
    assert.deepEqual(parseDeliveryRange("soon"), { min: 7, max: 7 });
  });
});

describe("getUpcomingHoliday", () => {
  it("returns the next holiday within the horizon", () => {
    const today = new Date("2026-04-01");

    assert.equal(
      getUpcomingHoliday(NIGERIA_HOLIDAYS_2026, today)?.name,
      "Founders' Celebration",
    );
  });

  it("returns null when no holiday falls within the horizon", () => {
    const today = new Date("2026-01-01");

    assert.equal(getUpcomingHoliday(NIGERIA_HOLIDAYS_2026, today), null);
  });

  it("returns null for an empty holiday list", () => {
    assert.equal(getUpcomingHoliday([], new Date("2026-04-01")), null);
  });
});
