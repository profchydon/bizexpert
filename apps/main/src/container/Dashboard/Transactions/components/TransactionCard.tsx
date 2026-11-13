"use client";

import type { ComponentType, ReactNode } from "react";
import {
  BankNote02,
  CalendarDate,
  CreditCard02,
  Package,
  Server02,
  User01,
} from "@untitledui/icons";
import dayjs from "dayjs";
import formatAmount from "@/utils/formatAmount";
import { IAllTransaction } from "@/types/transactions";
import TransactionStatusBadge from "./TransactionStatusBadge";
import TransactionCountriesDisplay from "./TransactionCountriesDisplay";
import TransactionTypeBadges from "./TransactionTypeBadges";
import TransactionActionButton from "./TransactionActionButton";
import { CopyReferenceButton } from "./CopyReferenceButton";
import { useListDetailHref } from "@/hooks/tableListLocation";
import routes from "@/routes";
import {
  formatTransactionMethod,
  isCreditMethod,
  isSystemGeneratedInitiator,
} from "../transactionMethodMeta";

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

export function TransactionCard({
  transaction,
}: {
  transaction: IAllTransaction;
}) {
  const viewHref = useListDetailHref(routes.TRANSACTION_DETAIL(transaction.id));
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
            Transaction ID
          </span>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-primary tabular-nums">
              {transaction.reference}
            </span>
            <CopyReferenceButton value={transaction.reference} />
          </div>
        </div>
        <TransactionStatusBadge status={transaction.status} />
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
          label="Items"
          value={transaction.number_of_equipments}
          icon={Package}
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

      <TransactionActionButton
        status={transaction.status}
        fullWidth
        viewHref={viewHref}
        viewKey={transaction.id}
        paymentLink={transaction.payment_link}
        dataTestId="transactioncardview-button"
      />
    </article>
  );
}
