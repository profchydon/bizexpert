import { formatNgn } from "@/lib/bizexpert/format";
import type { PaymentListItem } from "@/types/bizexpert";
import { paymentAmount, type PaymentListMetric } from "./paymentListMetrics";

export function buildPaymentTransactionMetrics(
  rows: PaymentListItem[],
): PaymentListMetric[] {
  const inflow = rows.reduce((sum, row) => sum + paymentAmount(row), 0);
  return [
    {
      id: "received",
      title: "Inflow",
      value: formatNgn(inflow),
      hint: `${rows.length} credit${rows.length === 1 ? "" : "s"}`,
    },
    {
      id: "count",
      title: "Transactions",
      value: String(rows.length),
    },
  ];
}
