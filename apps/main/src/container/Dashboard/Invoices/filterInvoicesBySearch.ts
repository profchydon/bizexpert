import type { IAllTransaction } from "@/types/transactions";
import { filterTransactionsBySearch } from "../Transactions/TransactionNestedPages/filterTransactionsBySearch";
import {
  invoiceAirwallexId,
  invoiceBadgeLabel,
  invoiceDisplayNumber,
  invoiceOrderNumbers,
} from "./invoiceFilterMeta";

export function filterInvoicesBySearch(
  transactionsData: unknown,
  search: string,
): IAllTransaction[] {
  const query = search.trim().toLowerCase();
  const byTransaction = filterTransactionsBySearch(transactionsData, search);
  if (!query) {
    return byTransaction;
  }

  const list = (transactionsData as IAllTransaction[] | undefined) ?? [];
  const matchedIds = new Set(byTransaction.map((item) => item.id));

  return list.filter((item) => {
    if (matchedIds.has(item.id)) {
      return true;
    }

    const haystack = [
      invoiceDisplayNumber(item.invoice),
      invoiceAirwallexId(item.invoice),
      item.invoice?.id,
      item.invoice?.number,
      item.invoice?.status,
      invoiceBadgeLabel(item.invoice),
      ...invoiceOrderNumbers(item),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
