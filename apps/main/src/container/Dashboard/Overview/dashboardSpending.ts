import type { IDashboard, IDashboardSpendingPanel } from "@/types/dashboard";

export type SpendTabId = "all" | "credit" | "card" | "bank";
export type SpendPeriodId = "12m" | "30d" | "7d";

export const SPEND_TABS: { id: SpendTabId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "credit", label: "Credit" },
  { id: "card", label: "Card" },
  { id: "bank", label: "Bank transfer" },
];

const METHOD_KEY = {
  all: "all",
  credit: "credit",
  card: "card",
  bank: "bank_transfer",
} as const;

const PERIOD_KEY = {
  "12m": "12_months",
  "30d": "30_days",
  "7d": "7_days",
} as const;

export function dashboardSpendingPanel(dashboard?: IDashboard | null) {
  return dashboard?.panels?.spending ?? null;
}

export function isDashboardSpendingVisible(dashboard?: IDashboard | null) {
  return dashboard?.access?.visibility?.spending !== false;
}

export function spendingSeries(
  panel: IDashboardSpendingPanel | null,
  tab: SpendTabId,
  period: SpendPeriodId,
) {
  return panel?.[METHOD_KEY[tab]]?.over_time?.[PERIOD_KEY[period]] ?? null;
}

export function spendAmountForTab(
  panel: IDashboardSpendingPanel | null,
  tab: SpendTabId,
  period: SpendPeriodId,
) {
  return Number(spendingSeries(panel, tab, period)?.total) || 0;
}

export function formatSpendingAmount(value: number, currencySymbol = "") {
  if (!Number.isFinite(value)) {
    return `${currencySymbol}0`;
  }

  return `${currencySymbol}${Math.round(value).toLocaleString("en-US")}`;
}

export function spendingRangeToPeriod(range?: string): SpendPeriodId | null {
  if (range === "12_months") {
    return "12m";
  }

  if (range === "30_days") {
    return "30d";
  }

  if (range === "7_days") {
    return "7d";
  }

  return null;
}

export function spendingChartPoints(
  panel: IDashboardSpendingPanel | null,
  tab: SpendTabId,
  period: SpendPeriodId,
) {
  return (spendingSeries(panel, tab, period)?.points ?? []).map((point) => ({
    label: point.label,
    value: Number(point.amount) || 0,
  }));
}

export function hasSpendingChartData(
  panel: IDashboardSpendingPanel | null,
  tab: SpendTabId,
  period: SpendPeriodId,
) {
  return (spendingSeries(panel, tab, period)?.points ?? []).some(
    (point) => Number(point.amount) > 0,
  );
}

export function creditFacilityFromPanel(panel: IDashboardSpendingPanel | null) {
  const wallet = panel?.credit?.wallet;
  const available = Number(wallet?.available);
  const limit = Number(wallet?.limit);

  return {
    available: Number.isFinite(available) ? available : 0,
    limit: Number.isFinite(limit) ? limit : 0,
  };
}

export function activeSpendingLabel(period: SpendPeriodId) {
  if (period !== "12m") {
    return undefined;
  }

  return new Date().toLocaleString("en-US", { month: "short" });
}
