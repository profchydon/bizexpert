import assert from "node:assert/strict";
import { test } from "node:test";
import { formatLocationType } from "./locationTypes";

test("formatLocationType maps known types", () => {
  assert.equal(formatLocationType("shop"), "Regular store");
  assert.equal(formatLocationType("warehouse"), "Warehouse");
  assert.equal(formatLocationType("branch"), "Regular store");
});

test("formatLocationType falls back to the raw value", () => {
  assert.equal(formatLocationType("kiosk"), "kiosk");
});
