import { resolveSafeInvoiceUrl } from "./resolveSafeInvoiceUrl";

export type TransactionDetailActionColor =
  | "primary"
  | "secondary"
  | "secondary-destructive";

export type TransactionDetailClick =
  | { type: "receipt"; url: string }
  | { type: "pay"; url: string }
  | { type: "none" };

export interface TransactionDetailActionPresentation {
  label: string;
  color: TransactionDetailActionColor;
  disabled: boolean;
  canOpenReceipt: boolean;
}

export function getTransactionDetailActionPresentation(
  status?: string | null,
): TransactionDetailActionPresentation {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized === "cancelled" || normalized === "canceled") {
    return {
      label: "Cancelled",
      color: "secondary",
      disabled: true,
      canOpenReceipt: false,
    };
  }

  if (normalized === "voided") {
    return {
      label: "Voided",
      color: "secondary",
      disabled: true,
      canOpenReceipt: false,
    };
  }

  if (normalized === "failed") {
    return {
      label: "Retry payment",
      color: "primary",
      disabled: false,
      canOpenReceipt: false,
    };
  }

  if (
    normalized === "fulfilled" ||
    normalized === "successful" ||
    normalized === "partial refund" ||
    normalized === "refunded"
  ) {
    return {
      label: "View receipt",
      color: "primary",
      disabled: false,
      canOpenReceipt: true,
    };
  }

  return {
    label: "Click to pay",
    color: "primary",
    disabled: false,
    canOpenReceipt: false,
  };
}

export function resolveTransactionDetailClick({
  status,
  paymentLink,
  invoiceUrl,
}: {
  status?: string | null;
  paymentLink?: string | null;
  invoiceUrl?: string | null;
}): TransactionDetailClick {
  const presentation = getTransactionDetailActionPresentation(status);
  if (presentation.disabled) {
    return { type: "none" };
  }

  if (presentation.canOpenReceipt) {
    const url = resolveSafeInvoiceUrl(invoiceUrl);
    return url ? { type: "receipt", url } : { type: "none" };
  }

  if (
    presentation.label === "Click to pay" ||
    presentation.label === "Retry payment"
  ) {
    const url = resolveSafeInvoiceUrl(paymentLink);
    return url ? { type: "pay", url } : { type: "none" };
  }

  return { type: "none" };
}

export function shouldShowTransactionDetailAction(
  status?: string | null,
  invoice?: object | null,
) {
  const presentation = getTransactionDetailActionPresentation(status);
  if (!presentation.canOpenReceipt) {
    return true;
  }
  return invoice != null;
}
