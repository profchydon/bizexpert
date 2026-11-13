import type { Product } from "@/types/bizexpert";

function matches(haystack: string | undefined, needle: string): boolean {
  return (haystack ?? "").toLowerCase().includes(needle);
}

export function filterProductsBySearch(
  rows: Product[],
  search: string,
): Product[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) =>
      matches(row.name, needle) ||
      matches(row.sku, needle) ||
      matches(row.barcode, needle) ||
      matches(row.category, needle),
  );
}
