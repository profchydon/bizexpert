import type { TaxDisplayMode } from "@/types/tax";
import type { SubscriberSavingFields } from "@/lib/pricing/subscriberSaving";
import { summaryTaxLabel } from "./display";
import { roundMoney } from "./math";

// Immutable per-order tax capture the backend stamps onto every fee summary.
export interface FeeSummaryTaxMetadata {
  device_tax_rate: number;
  service_tax_rate: number;
  device_tax_amount: number;
  service_tax_amount: number;
  tax_label_device: string | null;
  tax_label_service: string | null;
}

export interface FeeSummaryLike {
  currency?: { symbol?: string; code?: string } | null;
  total_fee?: number;
  device_tax?: number;
  service_tax?: number;
  tax_metadata?: FeeSummaryTaxMetadata | null;
  savings?: SubscriberSavingFields | null;
  [key: string]: unknown;
}

export interface FeeRow {
  key: string;
  name: string;
  value: number;
}

export interface TaxDisplayLabels {
  deviceLabel: string;
  serviceLabel: string;
}

const DEVICE_KEY = "total_purchase_price";
const DEVICE_TAX_KEY = "device_tax";
const SERVICE_TAX_KEY = "service_tax";
const TAX_ROW_KEY = "tax";

// The gateway fee is charged on the already-taxed total, so it is never a tax base and always
// reads last. Everything else in the ignore list is either metadata or not a money amount.
const GATEWAY_KEY = "payment_gateway_fee";
const IGNORED_KEYS = new Set([
  "currency",
  "total_fee",
  "tax_metadata",
  "fee_summary",
  "signature_requested",
  "savings",
]);

const DEFAULT_TAX_LABEL = "Tax";

function toTitleCase(key: string): string {
  return key.replaceAll("_", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase());
}

function toRow(key: string, value: unknown): FeeRow | null {
  const amount = typeof value === "number" ? value : Number(value);
  if (typeof value === "boolean" || !Number.isFinite(amount)) return null;
  return { key, name: toTitleCase(key), value: amount };
}

/**
 * Split `amount` across `rows` in proportion to their values, rounding each share to 2 decimals
 * and settling the rounding remainder on the last row so the shares always sum back to `amount`.
 */
function allocate(rows: FeeRow[], amount: number): FeeRow[] {
  const base = rows.reduce((sum, row) => sum + row.value, 0);
  if (amount === 0 || base <= 0) return rows;

  let allocated = 0;
  return rows.map((row, index) => {
    const isLast = index === rows.length - 1;
    const share = isLast
      ? roundMoney(amount - allocated)
      : roundMoney((row.value / base) * amount);
    allocated = roundMoney(allocated + share);
    return { ...row, value: roundMoney(row.value + share) };
  });
}

function deviceTaxLabel(metadata: FeeSummaryTaxMetadata): string {
  return metadata.tax_label_device || DEFAULT_TAX_LABEL;
}

function serviceTaxLabel(metadata: FeeSummaryTaxMetadata): string {
  return metadata.tax_label_service || DEFAULT_TAX_LABEL;
}

function resolveTaxLabels(
  metadata: FeeSummaryTaxMetadata,
  labels?: TaxDisplayLabels,
): TaxDisplayLabels {
  return {
    deviceLabel: labels?.deviceLabel ?? deviceTaxLabel(metadata),
    serviceLabel: labels?.serviceLabel ?? serviceTaxLabel(metadata),
  };
}

/**
 * Tax rows for tax-at-payment display. Checkout always shows one combined tax line; the
 * device/service split lives in the settings jurisdiction card, not in the breakdown.
 */
function taxRows(
  metadata: FeeSummaryTaxMetadata,
  labels?: TaxDisplayLabels,
): FeeRow[] {
  const deviceAmount = roundMoney(metadata.device_tax_amount);
  const serviceAmount = roundMoney(metadata.service_tax_amount);
  const combined = roundMoney(deviceAmount + serviceAmount);

  if (combined === 0) return [];

  const resolved = resolveTaxLabels(metadata, labels);

  return [taxRow(summaryTaxLabel(resolved), combined)];
}

function taxRow(name: string, value: number): FeeRow {
  return { key: TAX_ROW_KEY, name, value: roundMoney(value) };
}

function residualTaxRows(
  metadata: FeeSummaryTaxMetadata,
  deviceAmount: number,
  serviceAmount: number,
  labels?: TaxDisplayLabels,
): FeeRow[] {
  if (deviceAmount === 0 && serviceAmount === 0) return [];

  return taxRows(
    {
      ...metadata,
      device_tax_amount: roundMoney(deviceAmount),
      service_tax_amount: roundMoney(serviceAmount),
    },
    labels,
  );
}

// Reconstruct the tax capture for fee endpoints that predate `tax_metadata`, so an amount is
// still shown rather than silently dropped from the breakdown.
function readMetadata(summary: FeeSummaryLike): FeeSummaryTaxMetadata | null {
  if (summary.tax_metadata) return summary.tax_metadata;

  const deviceTax = Number(summary[DEVICE_TAX_KEY] ?? 0);
  const serviceTax = Number(summary[SERVICE_TAX_KEY] ?? 0);
  if (!deviceTax && !serviceTax) return null;

  return {
    device_tax_rate: 0,
    service_tax_rate: 0,
    device_tax_amount: deviceTax,
    service_tax_amount: serviceTax,
    tax_label_device: null,
    tax_label_service: null,
  };
}

/**
 * The single tax amount to show alongside breakdowns that group their own fee lines rather than
 * rendering `buildFeeRows`. Null when the order carries no tax.
 */
export function readTaxLine(
  summary: FeeSummaryLike | undefined,
  labels?: TaxDisplayLabels,
): { label: string; amount: number } | null {
  const metadata = summary ? readMetadata(summary) : null;
  if (!metadata) return null;

  const rows = taxRows(metadata, labels);
  if (rows.length === 0) return null;

  const amount = roundMoney(
    metadata.device_tax_amount + metadata.service_tax_amount,
  );
  if (amount === 0) return null;

  return {
    label: rows[0].name,
    amount,
  };
}

/**
 * Turn a backend `fee_summary` into the rows a checkout breakdown renders.
 *
 * The backend always charges the same total: net device price, net service fees, then tax on each.
 * Only the presentation differs. On tax-inclusive display the captured tax is folded back into the
 * lines it was charged on, so the device row matches the price browsed in the marketplace and no
 * separate tax line appears. On tax-at-payment display the lines stay net and the tax surfaces as
 * its own labelled row. Either way the rows sum to `fee_summary.total_fee`.
 */
export function buildFeeRows(
  summary: FeeSummaryLike | undefined,
  mode: TaxDisplayMode,
  labels?: TaxDisplayLabels,
): FeeRow[] {
  if (!summary) return [];

  const metadata = readMetadata(summary);

  let deviceRow: FeeRow | null = null;
  let gatewayRow: FeeRow | null = null;
  const serviceRows: FeeRow[] = [];

  for (const [key, value] of Object.entries(summary)) {
    if (IGNORED_KEYS.has(key)) continue;
    if (key === DEVICE_TAX_KEY || key === SERVICE_TAX_KEY) continue;

    const row = toRow(key, value);
    if (!row) continue;

    if (key === DEVICE_KEY) {
      deviceRow = row;
    } else if (key === GATEWAY_KEY) {
      gatewayRow = row;
    } else {
      serviceRows.push(row);
    }
  }

  if (metadata === null || mode !== "inclusive") {
    return [
      deviceRow,
      ...serviceRows,
      ...(metadata ? taxRows(metadata, labels) : []),
      gatewayRow,
    ].filter(isVisible);
  }

  const chargedServices = serviceRows.filter((row) => row.value !== 0);
  const foldsIntoServices = chargedServices.length > 0;
  const residualDeviceTax = deviceRow ? 0 : metadata.device_tax_amount;
  const residualServiceTax = foldsIntoServices
    ? 0
    : metadata.service_tax_amount;

  return [
    deviceRow && {
      ...deviceRow,
      value: roundMoney(deviceRow.value + metadata.device_tax_amount),
    },
    ...(foldsIntoServices
      ? allocate(chargedServices, metadata.service_tax_amount)
      : serviceRows),
    ...residualTaxRows(metadata, residualDeviceTax, residualServiceTax, labels),
    gatewayRow,
  ].filter(isVisible);
}

// Fees that do not apply are left out of the breakdown.
function isVisible(row: FeeRow | null | false): row is FeeRow {
  if (!row) return false;
  return row.value !== 0;
}
