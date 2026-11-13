"use client";

import type { ComponentType, ReactNode } from "react";
import {
  BankNote02,
  CalendarDate,
  CreditCard02,
  File06,
  Server02,
  User01,
} from "@untitledui/icons";
import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import { IAllTransaction } from "@/types/transactions";
import TransactionCountriesDisplay from "../Transactions/components/TransactionCountriesDisplay";
import TransactionTypeBadges from "../Transactions/components/TransactionTypeBadges";
import { CopyReferenceButton } from "../Transactions/components/CopyReferenceButton";
import {
  formatTransactionMethod,
  isCreditMethod,
  isSystemGeneratedInitiator,
} from "../Transactions/transactionMethodMeta";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import InvoiceViewButton from "./InvoiceViewButton";
import {
  invoiceAirwallexId,
  invoiceDisplayNumber,
  invoiceOrderNumbers,
} from "./invoiceFilterMeta";

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-tertiary">
        {Icon ? (
          <Icon className="size-3.5 shrink-0 text-fg-quaternary" />
        ) : null}
        {label}
      </span>
      <span className="text-right text-sm font-semibold break-words text-primary">
        {value}
      </span>
    </div>
  );
}

export function InvoiceCard({ transaction }: { transaction: IAllTransaction }) {
  const invoiceNumber = invoiceDisplayNumber(transaction.invoice);
  const airwallexId = invoiceAirwallexId(transaction.invoice);
  const orderNumbers = invoiceOrderNumbers(transaction);
  const MethodIcon = isCreditMethod(transaction.method)
    ? CreditCard02
    : BankNote02;
  const InitiatorIcon = isSystemGeneratedInitiator(transaction.initiated_by)
    ? Server02
    : User01;

  return (
    <article className="group relative flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-xs ring-1 ring-secondary transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-wider text-quaternary uppercase">
            Invoice
          </span>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="whitespace-nowrap text-sm font-semibold text-primary tabular-nums">
              {invoiceNumber}
            </span>
            {invoiceNumber !== "-" ? (
              <CopyReferenceButton value={invoiceNumber} />
            ) : null}
          </div>
        </div>
        <InvoiceStatusBadge invoice={transaction.invoice} />
      </header>

      <div className="flex flex-col gap-2">
        <span className="text-display-sm font-semibold tracking-tight text-primary tabular-nums">
          {transaction.currency_symbol}
          {formatAmount(transaction.amount)}
        </span>
        <div className="flex flex-wrap gap-1.5">
          <TransactionTypeBadges transaction={transaction} />
        </div>
      </div>

      <dl className="flex flex-col gap-3 border-t border-secondary pt-4">
        <Row
          label="Airwallex transaction ID"
          value={
            <span className="inline-flex items-center justify-end gap-1.5 whitespace-nowrap">
              {airwallexId}
              {airwallexId !== "-" ? (
                <CopyReferenceButton value={airwallexId} />
              ) : null}
            </span>
          }
        />
        <Row
          label="Order number"
          value={orderNumbers.length > 0 ? orderNumbers.join(", ") : "-"}
          icon={File06}
        />
        <Row
          label="Method"
          value={formatTransactionMethod(transaction.method)}
          icon={MethodIcon}
        />
        <Row
          label="Date"
          value={dayjs(transaction.date).format("D MMM YYYY")}
          icon={CalendarDate}
        />
        <Row
          label="Initiated by"
          value={transaction.initiated_by || "-"}
          icon={InitiatorIcon}
        />
      </dl>

      <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary px-3.5 py-2.5">
        <span className="text-[10px] font-semibold tracking-wider text-quaternary uppercase">
          Countries
        </span>
        <TransactionCountriesDisplay
          orderDetails={transaction.multiple_order_details}
        />
      </div>

      <InvoiceViewButton invoice={transaction.invoice} fullWidth />
    </article>
  );
}
