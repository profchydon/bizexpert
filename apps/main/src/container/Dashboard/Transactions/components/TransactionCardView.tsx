"use client";

import { IAllTransaction } from "@/types/transactions";
import { TransactionCard } from "./TransactionCard";
import { TransactionsEmptyState } from "./TransactionsEmptyState";

interface Props {
  transactions: IAllTransaction[];
  query: string;
}

const TransactionCardView = ({ transactions, query }: Props) => {
  if (transactions.length === 0) {
    return <TransactionsEmptyState query={query} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionCardView;
