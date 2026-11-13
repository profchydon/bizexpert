"use client";

import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import { IAllTransaction } from "@/types/transactions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "@/components/application/table/table";
import TransactionCountriesDisplay from "../Transactions/components/TransactionCountriesDisplay";
import TransactionTypeBadges from "../Transactions/components/TransactionTypeBadges";
import { CopyReferenceButton } from "../Transactions/components/CopyReferenceButton";
import { formatTransactionMethod } from "../Transactions/transactionMethodMeta";
import { InvoicesEmptyState } from "./InvoicesEmptyState";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceViewButton from "./InvoiceViewButton";
import {
  invoiceAirwallexId,
  invoiceDisplayNumber,
  invoiceOrderNumbers,
  type InvoiceFilter,
} from "./invoiceFilterMeta";

interface Props {
  transactions: IAllTransaction[];
  query: string;
  filter: InvoiceFilter;
}

const InvoiceTableView = ({ transactions, query, filter }: Props) => {
  if (transactions.length === 0) {
    return <InvoicesEmptyState query={query} filter={filter} />;
  }

  return (
    <TableCard.Root>
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Airwallex transaction ID</TableHead>
              <TableHead className="min-w-[9rem]">Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="min-w-[8.5rem]">Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Order number</TableHead>
              <TableHead>Countries</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const invoiceNumber = invoiceDisplayNumber(transaction.invoice);
              const airwallexId = invoiceAirwallexId(transaction.invoice);
              const orderNumbers = invoiceOrderNumbers(transaction);

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="whitespace-nowrap font-medium tracking-tight text-primary tabular-nums">
                        {invoiceNumber}
                      </span>
                      {invoiceNumber !== "-" ? (
                        <CopyReferenceButton value={invoiceNumber} />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="whitespace-nowrap font-medium tracking-tight text-primary tabular-nums">
                        {airwallexId}
                      </span>
                      {airwallexId !== "-" ? (
                        <CopyReferenceButton value={airwallexId} />
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <InvoiceStatusBadge invoice={transaction.invoice} />
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
                  <TableCell className="whitespace-nowrap">
                    {orderNumbers.length > 0 ? orderNumbers.join(", ") : "-"}
                  </TableCell>
                  <TableCell>
                    <TransactionCountriesDisplay
                      orderDetails={transaction.multiple_order_details}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <InvoiceViewButton invoice={transaction.invoice} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TableCard.Root>
  );
};

export default InvoiceTableView;
