import { ReactNode, type ComponentType } from "react";
import dayjs from "dayjs";
import {
  BankNote02,
  Building07,
  CalendarDate,
  CreditCard02,
  Package,
  Server02,
  User01,
} from "@untitledui/icons";
import formatAmount from "@/utils/formatAmount";
import { ITransactionDetail } from "@/types/transactions";
import TransactionStatusBadge from "../../components/TransactionStatusBadge";
import TransactionTypeBadges from "../../components/TransactionTypeBadges";
import TransactionAirwallexPanel from "./TransactionAirwallexPanel";
import {
  formatTransactionMethod,
  isCreditMethod,
  isSystemGeneratedInitiator,
} from "../../transactionMethodMeta";
import { resolveTransactionDisplayStatus } from "../../transactionActionMeta";
import { getTransactionEntityLabel } from "../../transactionEntityLabel";

interface Props {
  transaction?: ITransactionDetail;
}

const SummaryRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
}) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-tertiary">
      <Icon className="size-3.5 shrink-0 text-fg-quaternary" />
      <span>{label}</span>
    </dt>
    <dd className="text-right text-sm font-semibold break-words text-primary">
      {value}
    </dd>
  </div>
);

const TransactionSummaryCard = ({ transaction }: Props) => {
  const MethodIcon = isCreditMethod(transaction?.method)
    ? CreditCard02
    : BankNote02;
  const InitiatorIcon = isSystemGeneratedInitiator(transaction?.initiated_by)
    ? Server02
    : User01;
  const displayStatus = resolveTransactionDisplayStatus({
    status: transaction?.status,
    invoice: transaction?.invoice,
  });

  return (
    <aside className="flex h-fit flex-col gap-6 rounded-2xl bg-primary p-6 shadow-xs ring-1 ring-secondary lg:sticky lg:top-24 lg:w-80 lg:shrink-0">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-md font-semibold text-primary">
          Transaction summary
        </h2>
        {displayStatus ? (
          <TransactionStatusBadge status={displayStatus} />
        ) : null}
      </header>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-tertiary">Amount</span>
        <span className="text-display-sm font-semibold tracking-tight text-primary tabular-nums">
          {transaction?.currency_symbol}
          {formatAmount(transaction?.amount || 0)}
        </span>
        {transaction ? (
          <div className="flex flex-wrap gap-1.5">
            <TransactionTypeBadges transaction={transaction} />
          </div>
        ) : null}
      </div>

      <div className="h-px w-full bg-border-secondary" />

      <dl className="flex flex-col gap-3.5">
        <SummaryRow
          icon={MethodIcon}
          label="Method"
          value={formatTransactionMethod(transaction?.method)}
        />
        <SummaryRow
          icon={CalendarDate}
          label="Date"
          value={
            transaction?.date
              ? dayjs(transaction.date).format("D MMM YYYY")
              : "-"
          }
        />
        <SummaryRow
          icon={InitiatorIcon}
          label="Initiated by"
          value={transaction?.initiated_by || "-"}
        />
        <SummaryRow
          icon={Building07}
          label="Entity"
          value={getTransactionEntityLabel(transaction?.entity_name)}
        />
        <SummaryRow
          icon={Package}
          label="No. of equipment(s)"
          value={transaction?.number_of_equipments ?? 0}
        />
      </dl>

      <TransactionAirwallexPanel transaction={transaction} />
    </aside>
  );
};

export default TransactionSummaryCard;
