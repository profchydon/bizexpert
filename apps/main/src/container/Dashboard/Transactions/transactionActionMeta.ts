import {
  getTransactionDesignStatus,
  type TransactionDesignStatus,
} from "./transactionStatusMeta";
import type { ITransactionInvoice } from "@/types/transactions";

export type TransactionListAction = "view" | "retry";

export type TransactionDetailAction = {
  label: string;
  color: "primary" | "secondary";
  disabled: boolean;
  href?: string;
  icon: "receipt" | "pay" | "retry" | "off";
};

const DETAIL_BY_STATUS: Record<
  TransactionDesignStatus,
  Omit<TransactionDetailAction, "href" | "disabled">
> = {
  paid: { label: "View receipt", color: "primary", icon: "receipt" },
  pending: { label: "Click to pay", color: "primary", icon: "pay" },
  failed: { label: "Retry payment", color: "primary", icon: "retry" },
  cancelled: { label: "Cancelled", color: "secondary", icon: "off" },
  voided: { label: "Voided", color: "secondary", icon: "off" },
};

export const getTransactionListAction = (
  status?: string,
): TransactionListAction =>
  getTransactionDesignStatus(status) === "failed" ? "retry" : "view";

export const getInvoiceHostedUrl = (invoice?: ITransactionInvoice | null) =>
  invoice?.url?.trim() || "";

export const getInvoiceProcessorId = (invoice?: ITransactionInvoice | null) =>
  invoice?.number?.trim() || "";

const PAID_TRANSACTION_STATUSES = new Set(["fulfilled", "successful", "paid"]);

export const resolveTransactionDisplayStatus = ({
  status,
  invoice,
}: {
  status?: string;
  invoice?: ITransactionInvoice | null;
}) => {
  const invoiceStatus = invoice?.status?.trim() || "";
  const invoiceFailed = invoiceStatus.toLowerCase() === "failed";
  const transactionPaid = PAID_TRANSACTION_STATUSES.has(
    (status ?? "").trim().toLowerCase(),
  );

  if (invoiceFailed && (invoice?.paid_at?.trim() || transactionPaid)) {
    return invoice?.paid_at?.trim() ? "PAID" : status;
  }

  if (transactionPaid) {
    const invoiceDesign = getTransactionDesignStatus(invoiceStatus);
    if (!invoiceDesign || invoiceDesign === "pending") {
      return status;
    }
  }

  return invoiceStatus || status;
};

export const getTransactionDetailAction = ({
  status,
  paymentLink,
  invoice,
}: {
  status?: string;
  paymentLink?: string | null;
  invoice?: ITransactionInvoice | null;
}): TransactionDetailAction | null => {
  const designStatus =
    getTransactionDesignStatus(
      resolveTransactionDisplayStatus({ status, invoice }),
    ) ?? "cancelled";
  const base = DETAIL_BY_STATUS[designStatus];
  const invoiceHref = getInvoiceHostedUrl(invoice);
  const payHref = invoiceHref || paymentLink?.trim() || "";

  if (designStatus === "pending") {
    return null;
  }

  if (designStatus === "failed") {
    return { ...base, href: payHref || undefined, disabled: !payHref };
  }

  if (designStatus === "paid") {
    if (!invoice) {
      return null;
    }

    return {
      ...base,
      href: invoiceHref || undefined,
      disabled: !invoiceHref,
    };
  }

  return { ...base, disabled: true };
};
