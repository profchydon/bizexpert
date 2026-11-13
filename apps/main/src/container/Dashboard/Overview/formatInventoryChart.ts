import { format } from "date-fns";

export function formatInventoryChartPeriod(period: string | Date): string {
  const date = period instanceof Date ? period : new Date(period);
  if (Number.isNaN(date.getTime())) {
    return String(period);
  }
  return format(date, "d MMM");
}

export function formatInventoryAxisAmount(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function toInventoryChartRows(
  data: Array<{ period: string | Date; revenue: number; profit: number }>,
) {
  return data.map((row) => ({
    ...row,
    label: formatInventoryChartPeriod(row.period),
  }));
}
