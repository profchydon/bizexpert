import formatAmount from "@/utils/formatAmount";
import { IAllTransaction } from "@/types/transactions";
import {
  getTransactionStatusMeta,
  type TransactionStatusColor,
} from "../transactionStatusMeta";

export type TransactionStatus = IAllTransaction["status"];

export interface TransactionStatusPresentation {
  label: string;
  className: string;
  variant?: string;
  dotClassName?: string;
  detail?: string;
  tooltip?: string;
}

const BASE: Record<
  TransactionStatus,
  Omit<TransactionStatusPresentation, "detail" | "tooltip">
> = {
  Pending: {
    label: "Pending",
    className: "bg-warning-50 text-warning-700 border-warning-200",
    variant: "pending",
    dotClassName: "bg-warning-500",
  },
  "Awaiting Payment": {
    label: "Awaiting payment",
    className: "bg-warning-50 text-warning-700 border-warning-200",
    variant: "pending",
    dotClassName: "bg-warning-500",
  },
  Successful: {
    label: "Successful",
    className: "bg-success-50 text-success-700 border-success-200",
    variant: "success",
    dotClassName: "bg-success-500",
  },
  Failed: {
    label: "Failed",
    className: "bg-error-50 text-error-700 border-error-200",
    variant: "destructive",
    dotClassName: "bg-error-500",
  },
  Canceled: {
    label: "Canceled",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    variant: "gray",
    dotClassName: "bg-gray-400",
  },
  Refunded: {
    label: "Refunded",
    className: "bg-primary-50 text-primary-700 border-primary-200",
    variant: "blue",
    dotClassName: "bg-primary-500",
  },
  "Partial Refund": {
    label: "Partial refund",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    variant: "blue",
    dotClassName: "bg-blue-500",
  },
  Disputed: {
    label: "Disputed",
    className: "bg-warning-50 text-warning-700 border-warning-200",
    variant: "pending",
    dotClassName: "bg-warning-500",
  },
  Fulfilled: {
    label: "Paid",
    className: "bg-success-50 text-success-700 border-success-200",
    variant: "success",
    dotClassName: "bg-success-500",
  },
};

const COLOR_PRESENTATION: Record<
  TransactionStatusColor,
  Omit<TransactionStatusPresentation, "label" | "detail" | "tooltip">
> = {
  success: {
    className: "bg-success-50 text-success-700 border-success-200",
    variant: "success",
    dotClassName: "bg-success-500",
  },
  warning: {
    className: "bg-warning-50 text-warning-700 border-warning-200",
    variant: "pending",
    dotClassName: "bg-warning-500",
  },
  error: {
    className: "bg-error-50 text-error-700 border-error-200",
    variant: "destructive",
    dotClassName: "bg-error-500",
  },
  gray: {
    className: "bg-gray-100 text-gray-700 border-gray-200",
    variant: "gray",
    dotClassName: "bg-gray-400",
  },
  blue: {
    className: "bg-primary-50 text-primary-700 border-primary-200",
    variant: "blue",
    dotClassName: "bg-primary-500",
  },
};

function formatMoney(symbol: string | undefined, value: number): string {
  const prefix = symbol?.trim() ? `${symbol.trim()} ` : "";
  return `${prefix}${formatAmount(String(value))}`;
}

export function getTransactionStatusPresentation(
  status: string,
  options?: {
    refund?: number;
    amount?: number | string;
    currencySymbol?: string;
  },
): TransactionStatusPresentation {
  const base = BASE[status as TransactionStatus];
  if (!base) {
    if (!status.trim()) {
      return {
        label: "",
        className: "bg-gray-100 text-gray-700 border-gray-200",
      };
    }

    const meta = getTransactionStatusMeta(status);
    return {
      ...COLOR_PRESENTATION[meta.color],
      label: meta.label,
    };
  }

  const refund = Number(options?.refund ?? 0);
  const paid = Number(options?.amount ?? 0);
  const symbol = options?.currencySymbol;
  const presentation: TransactionStatusPresentation = { ...base };

  if (status === "Partial Refund" && refund > 0) {
    const remaining = paid > refund ? paid - refund : 0;
    presentation.tooltip =
      remaining > 0
        ? `${formatMoney(symbol, refund)} refunded · ${formatMoney(symbol, remaining)} still active on this transaction`
        : `${formatMoney(symbol, refund)} refunded`;
  }

  if (status === "Refunded" && refund > 0) {
    presentation.detail = formatMoney(symbol, refund);
    presentation.tooltip = `${formatMoney(symbol, refund)} returned to the customer`;
  }

  return presentation;
}

export function isOrderRefunded(status?: string | null): boolean {
  const normalized = (status ?? "").toLowerCase();
  return normalized === "cancelled" || normalized === "order_cancelled";
}
