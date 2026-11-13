import { currencySymbol } from "@/utils/currencySymbol";
import type { DeviceActionKind } from "../data/deviceActions";
import type { CheckoutItem } from "../hooks/useStorageCheckout";
import {
  lineFeeForAction,
  subtotalForActions,
  type StorageServiceFeeTable,
} from "./storageServiceFees";

export {
  buildStorageServiceFeeTable,
  lineFeeForAction,
  subtotalForActions,
  type StorageServiceFeeTable,
} from "./storageServiceFees";

export function lineFee(
  item: CheckoutItem,
  table: StorageServiceFeeTable | null | undefined,
): number {
  return lineFeeForAction(item, table);
}

export function subtotal(
  items: CheckoutItem[],
  table: StorageServiceFeeTable | null | undefined,
): number {
  return subtotalForActions(items, table);
}

export function cartCurrency(
  items: Array<{ currency?: string | null }>,
): string {
  for (const item of items) {
    const symbol = currencySymbol(item.currency);
    if (symbol) return symbol;
  }
  return "$";
}

export function formatMoney(value: number, currency?: string | null): string {
  const symbol = currencySymbol(currency) || "$";
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatFeePerDevice(
  fee: number,
  currency?: string | null,
): string {
  const symbol = currencySymbol(currency) || "$";
  return `${symbol}${fee} per device`;
}

export function formatUsd(value: number): string {
  return formatMoney(value);
}

export const CHECKOUT_ACTION_ORDER: DeviceActionKind[] = [
  "deployment",
  "device_check",
  "disposal",
];
