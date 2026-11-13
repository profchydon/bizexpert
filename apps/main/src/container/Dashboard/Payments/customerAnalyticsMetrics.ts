import { formatNgn } from "@/lib/bizexpert/format";
import { formatInventoryChartPeriod } from "../Overview/formatInventoryChart";
import type { PaymentListMetric } from "./paymentListMetrics";
import type {
  CustomerAnalytics,
  CustomerAnalyticsDay,
} from "./paymentsAnalyticsTypes";

export function buildCustomerAnalyticsMetrics(
  data: CustomerAnalytics | undefined,
): PaymentListMetric[] {
  return [
    {
      id: "count",
      title: "Customers",
      value: String(data?.totalCustomers ?? 0),
    },
    {
      id: "received",
      title: "New",
      value: String(data?.newCustomers ?? 0),
    },
    {
      id: "average",
      title: "Returning",
      value: String(data?.returningCustomers ?? 0),
    },
    {
      id: "spend",
      title: "Avg spend",
      value: formatNgn(data?.averageSpend),
    },
  ];
}

export function toCustomerAnalyticsChartRows(days: CustomerAnalyticsDay[]) {
  return days.map((row) => ({
    ...row,
    label: formatInventoryChartPeriod(row.period),
  }));
}
