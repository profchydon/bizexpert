import assert from "node:assert/strict";
import { test } from "node:test";
import { inventoryOverviewStartDate } from "./inventoryOverviewRange";

test("inventoryOverviewStartDate is 30 days before now", () => {
  const now = new Date("2026-11-08T00:00:00.000Z");
  const start = new Date(inventoryOverviewStartDate(now));
  assert.equal(start.toISOString(), "2026-10-09T00:00:00.000Z");
});
