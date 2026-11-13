import type { Sale } from "@/types/bizexpert";

export function filterSalesBySearch(rows: Sale[], query: string): Sale[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => {
    const haystack = [
      row.saleNumber,
      row.customerName,
      row.paymentStatus,
      row.status,
      row.location?.name,
      row.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
