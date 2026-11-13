import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultPaymentsAnalyticsFilters,
  paymentsAnalyticsParams,
  toDateInput,
} from "./paymentsAnalyticsRange";

test("default range is the current month through today", () => {
  const now = new Date(2026, 10, 8);
  const filters = defaultPaymentsAnalyticsFilters(now);
  assert.equal(filters.startDate, "2026-11-01");
  assert.equal(filters.endDate, "2026-11-08");
  assert.equal(filters.locationId, "");
});

test("paymentsAnalyticsParams omits a blank location", () => {
  assert.deepEqual(
    paymentsAnalyticsParams({
      locationId: "",
      startDate: "2026-11-01",
      endDate: "2026-11-08",
    }),
    {
      locationId: undefined,
      startDate: "2026-11-01",
      endDate: "2026-11-08",
    },
  );
});

test("toDateInput uses yyyy-MM-dd", () => {
  assert.equal(toDateInput(new Date(2026, 0, 5)), "2026-01-05");
});
