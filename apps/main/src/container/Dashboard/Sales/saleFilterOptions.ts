import type { PaymentMethod, SaleSource, SaleStatus } from "@/types/bizexpert";

export const SALE_STATUS_OPTIONS: { value: SaleStatus | ""; label: string }[] =
  [
    { value: "", label: "All statuses" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "refunded", label: "Refunded" },
  ];

export const SALE_SOURCE_OPTIONS: { value: SaleSource | ""; label: string }[] =
  [
    { value: "", label: "All sources" },
    { value: "web", label: "Web" },
    { value: "whatsapp", label: "WhatsApp" },
  ];

export const SALE_PAYMENT_METHOD_FILTER: {
  value: PaymentMethod | "";
  label: string;
}[] = [
  { value: "", label: "All payments" },
  { value: "cash", label: "Cash" },
  { value: "transfer", label: "Transfer" },
  { value: "pos", label: "POS" },
  { value: "credit", label: "Credit" },
];

export function formatSaleStatus(status: string): string {
  return (
    SALE_STATUS_OPTIONS.find((row) => row.value === status)?.label ?? status
  );
}

export function formatSaleSource(source: string): string {
  return (
    SALE_SOURCE_OPTIONS.find((row) => row.value === source)?.label ?? source
  );
}

export function formatPaymentMethod(method: string): string {
  return (
    SALE_PAYMENT_METHOD_FILTER.find((row) => row.value === method)?.label ??
    method
  );
}

export function formatPaymentStatus(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "partial") return "Partial";
  if (status === "credit") return "Credit";
  return status;
}
