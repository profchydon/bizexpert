import type { ITransactionDetail } from "@/types/transactions";
import { roundMoney } from "@/lib/tax/math";

export type TransactionInvoiceItem = NonNullable<
  ITransactionDetail["items_details"]
>[number];

export const normalizeInvoiceRowName = (value?: string) =>
  (value ?? "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export const isInvoiceSummaryRow = (name?: string) => {
  const normalized = normalizeInvoiceRowName(name);
  if (!normalized) return false;

  return (
    normalized === "total" ||
    normalized.endsWith(" subtotal") ||
    normalized.endsWith(" tax") ||
    normalized.includes(" subtotal ")
  );
};

export const invoiceLineItemKey = (row: TransactionInvoiceItem) => {
  const baseName = normalizeInvoiceRowName(row.name).replace(
    /\(\d+\s+(device|devices)\)/,
    "",
  );

  return [
    baseName,
    row.type?.trim().toLowerCase() ?? "",
    row.unit_price ?? 0,
    row.amount ?? 0,
    row.quantity ?? 0,
  ].join("|");
};

export const dedupeInvoiceLineItems = (rows: TransactionInvoiceItem[]) => {
  const seen = new Set<string>();

  return rows.filter((row) => {
    const key = invoiceLineItemKey(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const isServiceFeeRow = (row: TransactionInvoiceItem) =>
  normalizeInvoiceRowName(row.type) === "service fee";

export const sumInvoiceLineItems = (
  rows: TransactionInvoiceItem[],
  predicate: (row: TransactionInvoiceItem) => boolean,
) =>
  roundMoney(
    rows.filter(predicate).reduce((sum, row) => sum + (row.amount ?? 0), 0),
  );

export type TransactionInvoiceDisplay = {
  lineItems: TransactionInvoiceItem[];
  deviceSubtotal: number;
  serviceSubtotal: number;
  deviceTax: number;
  serviceTax: number;
  paymentGatewayFee: number;
  total: number;
  showTaxBreakdown: boolean;
};

export const buildTransactionInvoiceDisplay = (
  transaction?: ITransactionDetail,
): TransactionInvoiceDisplay => {
  const lineItems = dedupeInvoiceLineItems(
    (transaction?.items_details ?? []).filter(
      (row) => !isInvoiceSummaryRow(row.name),
    ),
  );

  const deviceSubtotal = sumInvoiceLineItems(
    lineItems,
    (row) => !isServiceFeeRow(row),
  );
  const serviceSubtotal = sumInvoiceLineItems(lineItems, isServiceFeeRow);
  const deviceTax = transaction?.tax_breakdown?.device_tax ?? 0;
  const serviceTax = transaction?.tax_breakdown?.service_tax ?? 0;
  const total = roundMoney(Number(transaction?.amount ?? 0));
  const paymentGatewayFee = roundMoney(
    total - deviceSubtotal - serviceSubtotal - deviceTax - serviceTax,
  );

  return {
    lineItems,
    deviceSubtotal,
    serviceSubtotal,
    deviceTax,
    serviceTax,
    paymentGatewayFee: paymentGatewayFee > 0 ? paymentGatewayFee : 0,
    total,
    showTaxBreakdown: deviceTax > 0 || serviceTax > 0,
  };
};
