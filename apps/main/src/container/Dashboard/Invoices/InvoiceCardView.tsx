"use client";

import { IAllTransaction } from "@/types/transactions";
import { InvoiceCard } from "./InvoiceCard";
import { InvoicesEmptyState } from "./InvoicesEmptyState";
import type { InvoiceFilter } from "./invoiceFilterMeta";

interface Props {
  transactions: IAllTransaction[];
  query: string;
  filter: InvoiceFilter;
}

const InvoiceCardView = ({ transactions, query, filter }: Props) => {
  if (transactions.length === 0) {
    return <InvoicesEmptyState query={query} filter={filter} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <InvoiceCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default InvoiceCardView;
