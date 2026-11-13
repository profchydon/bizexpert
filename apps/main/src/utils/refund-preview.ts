import type { CancellationPreviewResponse } from "@/api/baseQueries/companiesApi/ordersApi/getCancellationPreview";
import formatAmount from "@/utils/formatAmount";

export type RefundMethod =
  | "card"
  | "credit-wallet"
  | "bank-transfer"
  | "invoice";

export interface RefundExclusion {
  devices: number;
  excludedDevices: number;
  spentServices?: number;
  basis?: "hardware" | "services";
}

export interface RefundPreview {
  method: RefundMethod;
  methodLabel: string;
  amount: number;
  gatewayFee: number;
  net: number;
  unpaid: boolean;
  prefix: string;
  headlineLabel: string;
  headline: string;
  destination: string | null;
  rows: RefundRow[];
  note: string;
}

export type RefundRowKind = "payment" | "subtotal" | "deduction" | "total";

export interface RefundRow {
  label: string;
  value: string;
  deduction?: boolean;
  kind?: RefundRowKind;
}

export function refundRowKind(row: RefundRow): RefundRowKind {
  if (
    row.kind === "payment" ||
    row.kind === "subtotal" ||
    row.kind === "deduction" ||
    row.kind === "total"
  ) {
    return row.kind;
  }
  if (row.deduction) return "deduction";
  const label = row.label.toLowerCase();
  if (
    label === "you will receive" ||
    label === "credited back to you" ||
    label === "refund"
  ) {
    return "total";
  }
  if (label === "paid" || label === "service charges billed") return "subtotal";
  return "payment";
}

export function groupedRefundRows(rows: RefundRow[]) {
  const payments = rows.filter((row) => refundRowKind(row) === "payment");
  const subtotals = rows.filter((row) => refundRowKind(row) === "subtotal");
  const deductions = rows.filter((row) => refundRowKind(row) === "deduction");
  const totals = rows.filter((row) => refundRowKind(row) === "total");

  return {
    payments:
      payments.length === 0 && subtotals.length === 1 ? subtotals : payments,
    subtotal: payments.length > 0 ? (subtotals[0] ?? null) : null,
    deductions,
    total: totals[0] ?? null,
  };
}

const METHOD_LABELS: Record<RefundMethod, string> = {
  card: "Card",
  "credit-wallet": "Credit wallet",
  "bank-transfer": "Bank transfer",
  invoice: "Invoice",
};

export function formatWithPrefix(value: number, prefix: string): string {
  const formatted = formatAmount(String(Math.abs(value)));
  if (value < 0) return `-${prefix}${formatted}`;
  return `${prefix}${formatted}`;
}

export function currencyPrefix(currency?: string | null): string {
  return currency?.trim() ? `${currency.trim()} ` : "";
}

export function parseAmount(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatRowValue(value: number | string, prefix: string): string {
  if (typeof value === "number") {
    if (value < 0) return `-${prefix}${formatAmount(String(Math.abs(value)))}`;
    return `${prefix}${formatAmount(String(value))}`;
  }
  return String(value);
}

function destinationForRail(rail: RefundMethod): string | null {
  if (rail === "card") return "Back to your card, in 5 to 10 business days";
  if (rail === "credit-wallet") {
    return "Straight to your credit wallet, available right away";
  }
  if (rail === "bank-transfer") return "Back to the account you paid from";
  return null;
}

function noteForRail(rail: RefundMethod, spent: number): string {
  if (rail === "card") {
    return "The payment gateway keeps its processing fee when a payment is reversed, so it cannot be returned. It is not a Rayda charge.";
  }
  if (rail === "credit-wallet") {
    return spent > 0
      ? "Credit never left Rayda, so everything not already carried out returns to your balance."
      : "Credit never left Rayda, so the full amount returns to your balance.";
  }
  if (rail === "bank-transfer") {
    return spent > 0
      ? "No payment gateway sits in the middle, so everything not already carried out is returned."
      : "No payment gateway sits in the middle, so the full amount is returned.";
  }
  return "No payment has been collected, so your invoice is adjusted instead.";
}

export function mapApiRefundPreview(
  refund: CancellationPreviewResponse["refund_preview"],
  options?: { unpaid?: boolean },
): RefundPreview {
  const rail = (refund.rail || "card") as RefundMethod;
  const prefix = currencyPrefix(refund.currency);
  const net = refund.net_refund ?? 0;
  const unpaid = options?.unpaid ?? rail === "invoice";

  const rows = (refund.rows ?? []).map((row) => ({
    label: row.label,
    value: formatRowValue(row.value, prefix),
    deduction: row.deduction,
    kind: row.kind,
  }));

  let headlineLabel = "You will receive";
  if (rail === "credit-wallet") headlineLabel = "Credited back to you";
  if (unpaid && net === 0) headlineLabel = "Refund";

  const headline =
    unpaid && net === 0 ? "None due" : formatWithPrefix(net, prefix);

  return {
    method: rail,
    methodLabel: METHOD_LABELS[rail] ?? refund.payment_method,
    amount: refund.amount_paid ?? 0,
    gatewayFee: refund.gateway_fee ?? 0,
    net,
    unpaid,
    prefix,
    headlineLabel,
    headline,
    destination: net > 0 ? destinationForRail(rail) : null,
    rows,
    note: noteForRail(rail, refund.spent_services ?? 0),
  };
}
