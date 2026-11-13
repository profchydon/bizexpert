"use client";

import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import { IAllTransaction } from "@/types/transactions";
import { useTableListLocation } from "@/hooks/tableListLocation";
import { withListLocation } from "@/utils/tableListPage";
import routes from "@/routes";
import { useScopedViewNavigation } from "@/hooks/useViewNavigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "@/components/application/table/table";
import TransactionStatusBadge from "./TransactionStatusBadge";
import TransactionCountriesDisplay from "./TransactionCountriesDisplay";
import TransactionTypeBadges from "./TransactionTypeBadges";
import TransactionActionButton from "./TransactionActionButton";
import { CopyReferenceButton } from "./CopyReferenceButton";
import { TransactionsEmptyState } from "./TransactionsEmptyState";
import { formatTransactionMethod } from "../transactionMethodMeta";

interface Props {
  transactions: IAllTransaction[];
  query: string;
}

const TransactionTableView = ({ transactions, query }: Props) => {
  const { view, isViewLoading } = useScopedViewNavigation();
  const listLocation = useTableListLocation();

  if (transactions.length === 0) {
    return <TransactionsEmptyState query={query} />;
  }

  return (
    <TableCard.Root>
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead className="min-w-[9rem]">Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="min-w-[8.5rem]">Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>No. of equipment(s)</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      className="font-medium tracking-tight text-primary tabular-nums hover:underline disabled:opacity-60"
                      disabled={isViewLoading(transaction.id)}
                      onClick={() =>
                        view(
                          withListLocation(
                            routes.TRANSACTION_DETAIL(transaction.id),
                            listLocation,
                          ),
                          transaction.id,
                        )
                      }
                    >
                      {transaction.reference}
                    </button>
                    <CopyReferenceButton value={transaction.reference} />
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <TransactionStatusBadge
                    status={transaction.status}
                    refund={transaction.refund}
                    amount={transaction.amount}
                    currencySymbol={transaction.currency_symbol}
                    showDetail={transaction.status === "Refunded"}
                  />
                </TableCell>
                <TableCell className="font-medium text-primary tabular-nums">
                  {transaction.currency_symbol}
                  {formatAmount(transaction.amount)}
                </TableCell>
                <TableCell>
                  <TransactionTypeBadges transaction={transaction} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {dayjs(transaction.date).format("D MMM YYYY")}
                </TableCell>
                <TableCell>
                  {formatTransactionMethod(transaction.method)}
                </TableCell>
                <TableCell className="tabular-nums">
                  {transaction.number_of_equipments}
                </TableCell>
                <TableCell>
                  <TransactionCountriesDisplay
                    orderDetails={transaction.multiple_order_details}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <TransactionActionButton
                    status={transaction.status}
                    viewHref={withListLocation(
                      routes.TRANSACTION_DETAIL(transaction.id),
                      listLocation,
                    )}
                    viewKey={transaction.id}
                    paymentLink={transaction.payment_link}
                    dataTestId="transactiontableview-button"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableCard.Root>
  );
};

export default TransactionTableView;
