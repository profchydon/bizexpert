import type { TaxContext } from "@/hooks/useTaxContext";
import { grossUp } from "./math";

// Pure display helpers for browse, cart and checkout surfaces. These only ever name the tax that
// is already inside an amount: marketplace prices arrive grossed up from the pricing service and
// checkout lines carry the tax captured on the order, so nothing here re-applies a rate.

export function displayDeviceAmount(amount: number, _ctx: TaxContext): number {
  return amount;
}

export function displayServiceAmount(net: number, ctx: TaxContext): number {
  return ctx.mode === "inclusive" ? grossUp(net, ctx.config.serviceRate) : net;
}

// Short "incl. VAT" note for a browsed device price, only when a device tax actually applies.
export function inclAnnotation(ctx: TaxContext): string | null {
  if (ctx.mode === "inclusive" && ctx.config.deviceRate > 0) {
    return `incl. ${ctx.config.deviceLabel}`;
  }
  return null;
}

export function cartInclAnnotation(
  ctx: TaxContext,
  parts: { hasProducts: boolean; hasActions: boolean },
): string | null {
  if (ctx.mode !== "inclusive") return null;
  const { deviceRate, serviceRate, deviceLabel, serviceLabel } = ctx.config;
  if (parts.hasActions && !parts.hasProducts && serviceRate > 0) {
    return `incl. ${serviceLabel}`;
  }
  if (parts.hasProducts && deviceRate > 0) {
    return `incl. ${deviceLabel}`;
  }
  if (parts.hasActions && serviceRate > 0) {
    return `incl. ${serviceLabel}`;
  }
  return null;
}

export function cartSubtotalLabel(
  ctx: TaxContext,
  parts: { hasProducts: boolean; hasActions: boolean },
): string {
  const note = cartInclAnnotation(ctx, parts);
  if (!note) return "Subtotal";
  return `Subtotal (${note})`;
}

// Note for a payable total whose lines already carry tax, e.g. "Includes VAT". Null when the
// client reads tax as its own line, or when no tax applies at all.
export function inclusiveTotalNote(ctx: TaxContext): string | null {
  if (ctx.mode !== "inclusive") return null;
  if (ctx.config.deviceRate <= 0 && ctx.config.serviceRate <= 0) return null;

  return `Includes ${summaryTaxLabel(ctx.config)}`;
}

// Single summary label for the collapsed tax line, e.g. "VAT" / "GST" / "Sales Tax". Price rows
// show one tax amount with no percentage (design review, 23 Jul 2026); the device/service split
// and rates live in tooltips and the settings jurisdiction card.
export function summaryTaxLabel(config: {
  deviceLabel: string;
  serviceLabel: string;
}): string {
  return config.deviceLabel === config.serviceLabel
    ? config.deviceLabel
    : "Tax";
}

export function buildTaxSplitTooltip(
  currencySymbol: string,
  deviceTax: number,
  serviceTax: number,
): string {
  return `Device tax ${currencySymbol}${deviceTax.toFixed(2)} plus service tax ${currencySymbol}${serviceTax.toFixed(2)}.`;
}
