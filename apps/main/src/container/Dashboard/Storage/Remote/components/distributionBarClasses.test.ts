import assert from "node:assert/strict";
import { test } from "node:test";
import { DEVICE_TYPE_BAR_CLASS } from "../data/deviceTypeMeta";
import {
  distributionBarLegendCountClass,
  distributionBarSegmentClass,
  distributionBarTrackClass,
} from "./distributionBarClasses";

test("distribution bar track uses reference height and rounded track", () => {
  assert.match(distributionBarTrackClass, /h-2\.5/);
  assert.match(distributionBarTrackClass, /rounded-full/);
  assert.match(distributionBarTrackClass, /bg-secondary/);
});

test("distribution bar segments fill track height without tooltip max sizing", () => {
  assert.match(distributionBarSegmentClass, /h-full/);
  assert.match(distributionBarSegmentClass, /shrink-0/);
  assert.doesNotMatch(distributionBarSegmentClass, /w-max/);
});

test("distribution legend counts use primary emphasis", () => {
  assert.match(distributionBarLegendCountClass, /text-primary/);
  assert.match(distributionBarLegendCountClass, /font-semibold/);
});

test("storage device bar colors use theme utility tokens", () => {
  for (const className of Object.values(DEVICE_TYPE_BAR_CLASS)) {
    assert.match(className, /^bg-utility-[a-z-]+-500$/);
  }
});
