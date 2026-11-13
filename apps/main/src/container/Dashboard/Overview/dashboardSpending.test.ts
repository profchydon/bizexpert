import assert from "node:assert/strict";
import { test } from "node:test";
import type { IDashboard, IDashboardSpendingPanel } from "@/types/dashboard";
import {
  creditFacilityFromPanel,
  formatSpendingAmount,
  hasSpendingChartData,
  isDashboardSpendingVisible,
  spendAmountForTab,
  spendingChartPoints,
  spendingRangeToPeriod,
} from "./dashboardSpending";

const series = (
  total: number,
  points: Array<{ label: string; amount: number }>,
) => ({
  total,
  points: points.map((point, index) => ({ index: index + 1, ...point })),
});

const panel = (overrides: Partial<IDashboardSpendingPanel> = {}) =>
  ({
    all: {
      over_time: {
        "7_days": series(0, [
          { label: "Fri", amount: 0 },
          { label: "Sat", amount: 0 },
        ]),
        "30_days": series(27330, [
          { label: "1", amount: 420 },
          { label: "2", amount: 0 },
        ]),
        "12_months": series(1797602.2, [
          { label: "Jan", amount: 231400 },
          { label: "Feb", amount: 616369.76 },
        ]),
      },
    },
    credit: {
      wallet: {
        available: "18500",
        limit: "30000",
        used_percent: 38,
        terms_label: "Net 30",
      },
      over_time: {
        "7_days": series(0, [{ label: "Fri", amount: 0 }]),
        "12_months": series(385946.96, [{ label: "Jan", amount: 1200 }]),
      },
    },
    card: {
      over_time: {
        "30_days": series(27330, [{ label: "1", amount: 420 }]),
        "12_months": series(1411655.24, [{ label: "Jan", amount: 980 }]),
      },
    },
    bank_transfer: {
      over_time: {
        "12_months": series(0, [{ label: "Jan", amount: 0 }]),
      },
    },
    ...overrides,
  }) satisfies IDashboardSpendingPanel;

test("formatSpendingAmount rounds to whole currency units", () => {
  assert.equal(formatSpendingAmount(1797602.2, "£"), "£1,797,602");
  assert.equal(formatSpendingAmount(Number.NaN, "$"), "$0");
});

test("spendAmountForTab reads per-method over_time totals", () => {
  const spending = panel();
  assert.equal(spendAmountForTab(spending, "all", "12m"), 1797602.2);
  assert.equal(spendAmountForTab(spending, "all", "30d"), 27330);
  assert.equal(spendAmountForTab(spending, "all", "7d"), 0);
  assert.equal(spendAmountForTab(spending, "card", "12m"), 1411655.24);
  assert.equal(spendAmountForTab(spending, "bank", "12m"), 0);
  assert.equal(spendAmountForTab(null, "all", "12m"), 0);
});

test("over_time.range maps to the period control", () => {
  assert.equal(spendingRangeToPeriod("12_months"), "12m");
  assert.equal(spendingRangeToPeriod("30_days"), "30d");
  assert.equal(spendingRangeToPeriod("7_days"), "7d");
  assert.equal(spendingRangeToPeriod("year"), null);
});

test("all-zero over_time points are treated as no chart data", () => {
  assert.equal(hasSpendingChartData(panel(), "all", "7d"), false);
  assert.equal(hasSpendingChartData(panel(), "bank", "12m"), false);
});

test("each tab and period can render its own over_time series", () => {
  const spending = panel();
  assert.equal(hasSpendingChartData(spending, "all", "12m"), true);
  assert.equal(hasSpendingChartData(spending, "all", "30d"), true);
  assert.equal(hasSpendingChartData(spending, "credit", "12m"), true);
  assert.equal(hasSpendingChartData(spending, "card", "12m"), true);
  assert.deepEqual(spendingChartPoints(spending, "all", "12m")[0], {
    label: "Jan",
    value: 231400,
  });
});

test("creditFacilityFromPanel reads credit.wallet", () => {
  assert.deepEqual(creditFacilityFromPanel(panel()), {
    available: 18500,
    limit: 30000,
  });
});

test("creditFacilityFromPanel treats missing credit as zero", () => {
  assert.deepEqual(creditFacilityFromPanel(null), {
    available: 0,
    limit: 0,
  });
  assert.deepEqual(creditFacilityFromPanel(panel({ credit: undefined })), {
    available: 0,
    limit: 0,
  });
});

test("IDashboard panels.spending uses the extracted spending panel type", () => {
  const dashboard = {
    panels: { spending: panel() },
  } satisfies Pick<IDashboard, "panels">;
  assert.equal(
    dashboard.panels?.spending?.all?.over_time?.["12_months"]?.total,
    1797602.2,
  );
});

test("spending visibility follows access.visibility.spending", () => {
  const hidden = {
    access: { visibility: { spending: false } },
  } as IDashboard;
  assert.equal(isDashboardSpendingVisible(hidden), false);
  assert.equal(isDashboardSpendingVisible(undefined), true);
});
