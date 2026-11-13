import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isFuturePurchaseDate,
  todayIsoDate,
} from "./equipmentPurchaseDateLimits.ts";

describe("todayIsoDate", () => {
  it("formats the given day as the date input expects", () => {
    assert.equal(todayIsoDate(new Date(2026, 7, 20)), "2026-08-20");
  });

  it("pads single digit months and days", () => {
    assert.equal(todayIsoDate(new Date(2026, 0, 5)), "2026-01-05");
  });
});

describe("isFuturePurchaseDate", () => {
  const today = "2026-08-20";

  it("rejects a date after today", () => {
    assert.equal(isFuturePurchaseDate("2026-08-21", today), true);
    assert.equal(isFuturePurchaseDate("2027-01-01", today), true);
  });

  it("accepts today and any past date", () => {
    assert.equal(isFuturePurchaseDate(today, today), false);
    assert.equal(isFuturePurchaseDate("2026-08-19", today), false);
    assert.equal(isFuturePurchaseDate("2019-12-31", today), false);
  });

  it("treats an empty or missing date as valid, since it is optional", () => {
    assert.equal(isFuturePurchaseDate("", today), false);
    assert.equal(isFuturePurchaseDate("   ", today), false);
    assert.equal(isFuturePurchaseDate(undefined, today), false);
  });

  it("compares across year and month boundaries", () => {
    assert.equal(isFuturePurchaseDate("2026-09-01", "2026-08-31"), true);
    assert.equal(isFuturePurchaseDate("2026-12-31", "2027-01-01"), false);
  });
});
