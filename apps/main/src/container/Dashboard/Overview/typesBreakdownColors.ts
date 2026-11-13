export const TYPES_BREAKDOWN_COLORS = [
  "var(--color-utility-brand-900)",
  "var(--color-utility-brand-800)",
  "var(--color-utility-brand-600)",
  "var(--color-utility-brand-400)",
  "var(--color-utility-brand-300)",
] as const;

export function toTypesBreakdownChartData<T extends { count: number }>(
  items: T[],
) {
  return [...items]
    .sort((a, b) => b.count - a.count)
    .map((item, index) => ({
      ...item,
      fill: TYPES_BREAKDOWN_COLORS[index % TYPES_BREAKDOWN_COLORS.length],
    }));
}
