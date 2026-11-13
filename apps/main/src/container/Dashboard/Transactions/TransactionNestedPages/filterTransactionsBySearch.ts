import type { IAllTransaction } from "@/types/transactions";
import { formatTransactionMethod } from "../transactionMethodMeta";
import { getTransactionStatusMeta } from "../transactionStatusMeta";

export function filterTransactionsBySearch(
  transactionsData: unknown,
  search: string,
): IAllTransaction[] {
  const list = (transactionsData as IAllTransaction[] | undefined) ?? [];
  const query = search.trim().toLowerCase();
  if (!query) return list;

  return list.filter((item) => {
    const haystack = [
      item.reference,
      item.order_number,
      item.method,
      formatTransactionMethod(item.method),
      item.payment,
      item.status,
      getTransactionStatusMeta(item.status).label,
      String(item.amount ?? ""),
      item.initiated_by,
      ...(item.multiple_order_details ?? []).flatMap((detail) => [
        detail.order_number,
        detail.country_name,
        detail.type,
      ]),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
