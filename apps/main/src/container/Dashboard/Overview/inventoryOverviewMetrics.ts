import { formatNgn } from "@/lib/bizexpert/format";
import type {
  CollectionSummary,
  InventoryOverviewMetric,
  SalesSummary,
} from "./inventoryOverviewTypes";

export type {
  CollectionSummary,
  InventoryOverviewMetric,
  SalesSummary,
} from "./inventoryOverviewTypes";

function money(value: number | undefined): string {
  return formatNgn(value ?? 0);
}

export function buildInventoryOverviewMetrics(
  summary: SalesSummary | undefined,
  collections: CollectionSummary | undefined,
  inventoryValue?: number,
): InventoryOverviewMetric[] {
  const revenue = collections?.totalRevenue ?? summary?.totalRevenue ?? 0;
  const margin = summary?.grossMarginPct;

  return [
    { id: "revenue", title: "Revenue (30d)", value: money(revenue) },
    {
      id: "profit",
      title: "Gross profit",
      value: money(summary?.grossProfit),
      hint: typeof margin === "number" ? `${margin}% margin` : undefined,
    },
    {
      id: "cash",
      title: "Cash collected",
      value: money(collections?.cashCollected),
    },
    {
      id: "inventory",
      title: "Inventory value",
      value: money(inventoryValue),
      hint: "Weighted-average cost",
    },
    {
      id: "credit",
      title: "Outstanding credit",
      value: money(collections?.outstandingCredit),
    },
    {
      id: "sales",
      title: "Completed sales",
      value: String(summary?.completedSalesCount ?? 0),
    },
    {
      id: "aov",
      title: "Avg order",
      value: money(summary?.averageOrderValue),
    },
  ];
}
