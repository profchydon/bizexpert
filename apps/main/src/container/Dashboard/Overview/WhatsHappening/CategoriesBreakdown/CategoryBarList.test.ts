import assert from "node:assert/strict";
import { test } from "node:test";
import { categoryBarFillPercent } from "./CategoryBarList";

test("the largest type fills the track", () => {
  assert.equal(categoryBarFillPercent(139, 139), 100);
});

test("smaller types scale against the largest count", () => {
  assert.equal(categoryBarFillPercent(69.5, 139), 50);
  assert.equal(categoryBarFillPercent(0, 139), 0);
});

test("an empty series does not divide by zero", () => {
  assert.equal(categoryBarFillPercent(0, 0), 0);
});
