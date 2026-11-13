import type { PaymentListItem } from "@/types/bizexpert";

export function filterPaymentsBySearch(
  rows: PaymentListItem[],
  query: string,
): PaymentListItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => {
    const haystack = [
      row.sale?.saleNumber,
      row.sale?.customerName,
      row.sale?.location?.name,
      row.method,
      row.reference,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
