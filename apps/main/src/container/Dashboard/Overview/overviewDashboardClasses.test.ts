import assert from "node:assert/strict";
import { test } from "node:test";
import {
  overviewCardShellClass,
  overviewMetricGridClass,
  overviewTwoColumnGridClass,
} from "./overviewDashboardClasses";

test("overview card shells use light borders and primary surfaces", () => {
  assert.match(overviewCardShellClass, /border-border-secondary/);
  assert.match(overviewCardShellClass, /bg-primary/);
  assert.match(overviewCardShellClass, /rounded-xl/);
});

test("overview metric row matches the reference grid", () => {
  assert.match(overviewMetricGridClass, /grid-cols-2/);
  assert.match(overviewMetricGridClass, /sm:grid-cols-3/);
  assert.match(overviewMetricGridClass, /lg:grid-cols-5/);
});

test("overview two-column section uses a 7/3 split on large screens", () => {
  assert.match(overviewTwoColumnGridClass, /lg:grid-cols-\[7fr_3fr\]/);
});
