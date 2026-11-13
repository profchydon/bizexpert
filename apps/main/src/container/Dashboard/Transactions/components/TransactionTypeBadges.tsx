"use client";

import { Badge } from "@/components/base/badges/badges";
import { IAllTransaction, ITransactionDetail } from "@/types/transactions";
import {
  getTransactionTypeMeta,
  resolveTransactionTypeValues,
} from "../transactionTypeMeta";

interface Props {
  transaction: IAllTransaction &
    Pick<ITransactionDetail, "items_details" | "multiple_order_details">;
  size?: "sm" | "md";
}

const walletKindLabels: Record<
  NonNullable<IAllTransaction["wallet_kind"]>,
  { label: string; color: "brand" | "success" }
> = {
  cancellation_refund: {
    label: "Refund",
    color: "brand",
  },
  top_up: {
    label: "Top up",
    color: "success",
  },
};

export const TransactionTypeBadge = ({
  type,
  size = "sm",
}: {
  type?: string;
  size?: "sm" | "md";
}) => {
  const meta = getTransactionTypeMeta(type);
  if (!meta) {
    return null;
  }

  return (
    <Badge color={meta.color} size={size} type="pill-color">
      {meta.label}
    </Badge>
  );
};

const TransactionTypeBadges = ({ transaction, size = "sm" }: Props) => {
  if (transaction.wallet_kind) {
    const walletBadge = walletKindLabels[transaction.wallet_kind];

    return (
      <Badge
        className="inline-flex shrink-0 whitespace-nowrap"
        color={walletBadge.color}
        size={size}
        type="pill-color"
      >
        {walletBadge.label}
      </Badge>
    );
  }

  const types = resolveTransactionTypeValues(transaction);

  if (types.length === 0) {
    return <span className="text-sm text-tertiary">-</span>;
  }

  return (
    <div className="inline-flex flex-wrap items-center gap-1">
      {types.map((type) => (
        <TransactionTypeBadge
          key={`${transaction.id}-${type}`}
          type={type}
          size={size}
        />
      ))}
    </div>
  );
};

export default TransactionTypeBadges;
