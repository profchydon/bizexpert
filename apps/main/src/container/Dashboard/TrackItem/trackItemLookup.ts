import type { InventoryBalance, Product } from "@/types/bizexpert";
import { toQuantityNumber } from "../Inventory/inventoryStatus";

export function isMissingBarcodeLookup(status: number | undefined): boolean {
  return status === 404 || status === 400;
}

export function lookupErrorStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  if (!("response" in error)) return undefined;
  const response = (error as { response?: { status?: number } }).response;
  return response?.status;
}

export function mergeTrackItemMatches(
  barcodeHit: Product | null,
  searchHits: Product[],
): Product[] {
  const byId = new Map<string, Product>();
  if (barcodeHit) byId.set(barcodeHit.id, barcodeHit);
  for (const product of searchHits) {
    if (!byId.has(product.id)) byId.set(product.id, product);
  }
  return [...byId.values()];
}

export function filterBalancesForProduct(
  balances: InventoryBalance[],
  productId: string,
): InventoryBalance[] {
  return balances.filter((row) => row.productId === productId);
}

export function totalBalanceQuantity(rows: InventoryBalance[]): number {
  return rows.reduce((sum, row) => sum + toQuantityNumber(row.quantity), 0);
}

export function storesWithStock(rows: InventoryBalance[]): number {
  return rows.filter((row) => toQuantityNumber(row.quantity) > 0).length;
}

export function totalBalanceValue(rows: InventoryBalance[]): number {
  return rows.reduce((sum, row) => sum + toQuantityNumber(row.totalValue), 0);
}

export function productCodeLabel(product: Product): string {
  return product.sku || product.barcode || "—";
}
