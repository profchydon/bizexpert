import { formatNgn } from "@/lib/bizexpert/format";
import type { PaymentListItem } from "@/types/bizexpert";

export type PaymentListMetric = {
  id: string;
  title: string;
  value: string;
  hint?: string;
};

export function paymentAmount(row: PaymentListItem): number {
  const n = Number(row.amount ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function buildPaymentListMetrics(
  rows: PaymentListItem[],
): PaymentListMetric[] {
  const received = rows.reduce((sum, row) => sum + paymentAmount(row), 0);
  const average = rows.length ? received / rows.length : 0;
  return [
    {
      id: "received",
      title: "Received",
      value: formatNgn(received),
      hint: `${rows.length} payment${rows.length === 1 ? "" : "s"}`,
    },
    {
      id: "count",
      title: "Payments",
      value: String(rows.length),
    },
    {
      id: "average",
      title: "Average",
      value: formatNgn(average),
    },
  ];
}
