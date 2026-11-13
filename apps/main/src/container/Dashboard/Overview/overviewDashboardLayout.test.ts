import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categoriesBreakdownLayoutClass,
  formatOverviewBalanceAmount,
  getOrderFrequencyChartSettings,
  orderFrequencyChartCanvasClass,
  orderFrequencyChartShellClass,
  overviewChartsSectionClass,
  overviewResponsiveTableClass,
} from "./overviewDashboardLayout";
import { overviewMetricGridClass } from "./overviewDashboardClasses";

test("summary cards use the reference metric grid", () => {
  assert.match(overviewMetricGridClass, /grid-cols-2/);
  assert.match(overviewMetricGridClass, /lg:grid-cols-5/);
});

test("overview chart sections stack on mobile and use a 7/3 split on large screens", () => {
  assert.match(overviewChartsSectionClass, /grid-cols-1/);
  assert.match(overviewChartsSectionClass, /lg:grid-cols-\[7fr_3fr\]/);
  assert.doesNotMatch(overviewChartsSectionClass, /items-start/);
});

test("order frequency chart supports horizontal scroll on narrow screens", () => {
  assert.match(orderFrequencyChartShellClass, /overflow-x-auto/);
  assert.match(orderFrequencyChartShellClass, /lg:overflow-visible/);
  assert.match(orderFrequencyChartCanvasClass, /min-w-\[34rem\]/);
  assert.match(orderFrequencyChartCanvasClass, /lg:h-\[250px\]/);
});

test("order frequency chart uses desktop sizing on large screens", () => {
  const large = getOrderFrequencyChartSettings(true);
  const compact = getOrderFrequencyChartSettings(false);

  assert.equal(large.barSize, 32);
  assert.equal(compact.barSize, 18);
  assert.equal(large.xAxisInterval, 0);
  assert.equal(compact.minTickGap, 12);
});

test("types breakdown matches the reference donut and stacked legend", () => {
  assert.match(categoriesBreakdownLayoutClass.content, /flex-col/);
  assert.match(categoriesBreakdownLayoutClass.content, /sm:flex-row/);
  assert.match(categoriesBreakdownLayoutClass.legend, /flex-col/);
  assert.match(categoriesBreakdownLayoutClass.legendLabel, /text-secondary/);
  assert.match(categoriesBreakdownLayoutClass.chartCanvasClass, /h-\[160px\]/);
  assert.match(categoriesBreakdownLayoutClass.chartCanvasClass, /w-\[160px\]/);
});

test("overview tables switch layouts at the large breakpoint", () => {
  assert.match(overviewResponsiveTableClass.desktop, /hidden lg:block/);
  assert.match(overviewResponsiveTableClass.mobile, /lg:hidden/);
});

test("formatOverviewBalanceAmount shows the full formatted balance", () => {
  assert.equal(
    formatOverviewBalanceAmount(69999999597064, "£"),
    "£69,999,999,597,064.00",
  );
  assert.equal(formatOverviewBalanceAmount(1250, "€"), "€1,250.00");
});

test("formatOverviewBalanceAmount handles invalid values", () => {
  assert.equal(formatOverviewBalanceAmount(undefined, "$"), "$0");
});
