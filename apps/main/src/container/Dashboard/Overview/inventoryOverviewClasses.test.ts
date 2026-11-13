import assert from "node:assert/strict";
import { test } from "node:test";
import {
  inventoryOverviewMetricCardClass,
  inventoryOverviewMetricGridClass,
  inventoryOverviewPageClass,
  inventoryOverviewTwoColumnClass,
} from "./inventoryOverviewClasses";

test("inventory overview metrics use light cards", () => {
  assert.equal(inventoryOverviewMetricCardClass.includes("bg-white"), true);
  assert.equal(
    inventoryOverviewMetricCardClass.includes("ring-gray-200"),
    true,
  );
  assert.equal(inventoryOverviewMetricCardClass.includes("bg-gray-900"), false);
  assert.equal(
    inventoryOverviewMetricGridClass.includes("lg:grid-cols-3"),
    true,
  );
  assert.equal(
    inventoryOverviewMetricGridClass.includes("xl:grid-cols-4"),
    true,
  );
});

test("inventory overview layout matches other dashboard pages", () => {
  assert.equal(inventoryOverviewPageClass.includes("pt-8"), true);
  assert.equal(
    inventoryOverviewTwoColumnClass.includes("xl:grid-cols-2"),
    true,
  );
});
