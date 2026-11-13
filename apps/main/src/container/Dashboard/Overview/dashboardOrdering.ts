import type { IDashboard, IOrderFrequency } from "@/types/dashboard";

export function monthLabelFromIndex(month: string | number) {
  const index = Number(month) - 1;

  if (index >= 0 && index < 12) {
    return new Date(2000, index, 1).toLocaleString("en-US", { month: "short" });
  }

  return String(month);
}

export function aggregateOrderFrequency(rows: IOrderFrequency[]) {
  const totals = new Map<string, number>();

  for (const row of rows) {
    const label = monthLabelFromIndex(row.month);
    totals.set(label, (totals.get(label) ?? 0) + Number(row.count || 0));
  }

  return [...totals].map(([month, orders]) => ({ month, orders }));
}

export function dashboardTypesBreakdown(dashboard?: IDashboard | null) {
  const fromPanel = dashboard?.panels?.ordering?.types_breakdown;

  if (fromPanel?.length) {
    return fromPanel;
  }

  return dashboard?.equipment_by_category ?? [];
}

export function dashboardOrderingFrequency(dashboard?: IDashboard | null) {
  const panelPoints = dashboard?.panels?.ordering?.frequency;

  if (panelPoints?.length) {
    return panelPoints.map((point) => ({
      month: point.label,
      orders: point.count,
    }));
  }

  return aggregateOrderFrequency(dashboard?.order_frequency ?? []);
}

export function hasOrderingFrequencyData(dashboard?: IDashboard | null) {
  return dashboardOrderingFrequency(dashboard).some((row) => row.orders > 0);
}
