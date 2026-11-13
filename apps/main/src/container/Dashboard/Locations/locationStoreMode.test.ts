import assert from "node:assert/strict";
import { test } from "node:test";
import {
  locationTypeToStoreMode,
  storeModeToLocationType,
} from "./locationStoreMode";

test("locationTypeToStoreMode treats shop and branch as regular", () => {
  assert.equal(locationTypeToStoreMode("shop"), "regular");
  assert.equal(locationTypeToStoreMode("branch"), "regular");
  assert.equal(locationTypeToStoreMode("warehouse"), "warehouse");
});

test("storeModeToLocationType maps warehouse and regular", () => {
  assert.equal(storeModeToLocationType("warehouse"), "warehouse");
  assert.equal(storeModeToLocationType("regular"), "shop");
  assert.equal(storeModeToLocationType("regular", "branch"), "branch");
});
