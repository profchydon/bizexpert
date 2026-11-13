import type { StockMovement } from "@/types/bizexpert";

export function filterStockRemovalsBySearch(
  rows: StockMovement[],
  query: string,
): StockMovement[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => {
    const haystack = [
      row.product?.name,
      row.location?.name,
      row.reason,
      row.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
