import { formatNgn } from "@/lib/bizexpert/format";
import type { Sale } from "@/types/bizexpert";
import { saleOutstanding } from "./saleTotals";

export type SalesListMetric = {
  id: string;
  title: string;
  value: string;
  hint?: string;
};

function sumAmount(rows: Sale[], key: "totalAmount" | "grossProfit"): number {
  return rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
}

export function buildSalesListMetrics(sales: Sale[]): SalesListMetric[] {
  const completed = sales.filter((row) => row.status === "completed");
  const revenue = sumAmount(completed, "totalAmount");
  const profit = sumAmount(completed, "grossProfit");
  const outstanding = completed.reduce(
    (sum, row) => sum + saleOutstanding(row),
    0,
  );
  const average = completed.length ? revenue / completed.length : 0;

  return [
    {
      id: "revenue",
      title: "Revenue",
      value: formatNgn(revenue),
      hint: `${completed.length} completed`,
    },
    {
      id: "profit",
      title: "Gross profit",
      value: formatNgn(profit),
    },
    {
      id: "credit",
      title: "Outstanding",
      value: formatNgn(outstanding),
    },
    {
      id: "aov",
      title: "Avg order",
      value: formatNgn(average),
    },
  ];
}
