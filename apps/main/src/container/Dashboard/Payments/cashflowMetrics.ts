import { formatNgn } from "@/lib/bizexpert/format";
import { formatInventoryChartPeriod } from "../Overview/formatInventoryChart";
import type { PaymentListMetric } from "./paymentListMetrics";
import type { CashflowAnalytics, CashflowDay } from "./paymentsAnalyticsTypes";

export function buildCashflowMetrics(
  data: CashflowAnalytics | undefined,
): PaymentListMetric[] {
  return [
    {
      id: "received",
      title: "Inflow",
      value: formatNgn(data?.inflowAmount),
      hint: `${data?.inflowCount ?? 0} payments`,
    },
    {
      id: "count",
      title: "Outflow",
      value: formatNgn(data?.outflowAmount),
      hint: `${data?.outflowCount ?? 0} purchases`,
    },
    {
      id: "average",
      title: "Net cash",
      value: formatNgn((data?.inflowAmount ?? 0) - (data?.outflowAmount ?? 0)),
    },
  ];
}

export function toCashflowChartRows(days: CashflowDay[]) {
  return days.map((row) => ({
    ...row,
    label: formatInventoryChartPeriod(row.period),
  }));
}
