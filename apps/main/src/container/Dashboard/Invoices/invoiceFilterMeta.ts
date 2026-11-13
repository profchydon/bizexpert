import type {
  IAllTransaction,
  ITransactionInvoice,
} from "@/types/transactions";

export type InvoiceFilter = "all" | "unpaid" | "paid";
export type InvoiceView = "card" | "table";

export type InvoiceFilterTab = {
  key: InvoiceFilter;
  label: string;
};

export const invoiceFilterTabs: InvoiceFilterTab[] = [
  { key: "all", label: "All" },
  { key: "unpaid", label: "Unpaid" },
  { key: "paid", label: "Paid" },
];

export const invoiceFilterToApiParam = (
  filter: InvoiceFilter,
): "all" | "paid" | "unpaid" => filter;

export const invoiceDisplayNumber = (invoice?: ITransactionInvoice | null) =>
  invoice?.number?.trim() || "-";

export const invoiceAirwallexId = (invoice?: ITransactionInvoice | null) =>
  invoice?.id?.trim() || "-";

export const invoiceViewUrl = (invoice?: ITransactionInvoice | null) =>
  invoice?.url?.trim() || invoice?.pdf_url?.trim() || "";

export const invoiceOrderNumbers = (transaction: IAllTransaction): string[] => {
  const numbers = [
    transaction.order_number,
    ...(transaction.multiple_order_details ?? []).map(
      (detail) => detail.order_number,
    ),
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

  return [...new Set(numbers)];
};

export const invoiceDisplayStatus = (invoice?: ITransactionInvoice | null) => {
  if (invoice?.paid_at?.trim()) {
    return "PAID";
  }

  const status = invoice?.status?.trim();
  if (status) {
    return status.toUpperCase();
  }

  return "UNPAID";
};

export const invoiceBadgeLabel = (invoice?: ITransactionInvoice | null) => {
  const status = invoiceDisplayStatus(invoice);
  if (status === "PAID") {
    return "Paid";
  }
  if (status === "VOID" || status === "VOIDED" || status === "UNCOLLECTIBLE") {
    return "Voided";
  }
  if (status === "FAILED") {
    return "Failed";
  }

  return "Unpaid";
};

export const invoiceBadgeTone = (
  invoice?: ITransactionInvoice | null,
): "success" | "warning" | "error" | "gray" => {
  const status = invoiceDisplayStatus(invoice);
  if (status === "PAID") {
    return "success";
  }
  if (status === "VOID" || status === "VOIDED" || status === "UNCOLLECTIBLE") {
    return "gray";
  }
  if (status === "FAILED") {
    return "error";
  }

  return "warning";
};
