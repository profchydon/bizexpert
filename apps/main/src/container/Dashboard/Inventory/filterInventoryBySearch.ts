import type {
  InventoryBalance,
  StockMovement,
  Stocktake,
  StockTransfer,
} from "@/types/bizexpert";

function matches(haystack: string | undefined, needle: string): boolean {
  return (haystack ?? "").toLowerCase().includes(needle);
}

export function filterBalancesBySearch(
  rows: InventoryBalance[],
  search: string,
): InventoryBalance[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) =>
      matches(row.product?.name, needle) || matches(row.location?.name, needle),
  );
}

export function filterTransfersBySearch(
  rows: StockTransfer[],
  search: string,
): StockTransfer[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) =>
      matches(row.transferNumber, needle) ||
      matches(row.sourceLocation?.name, needle) ||
      matches(row.destinationLocation?.name, needle) ||
      matches(row.status, needle),
  );
}

export function filterMovementsBySearch(
  rows: StockMovement[],
  search: string,
): StockMovement[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) => matches(row.product?.name, needle) || matches(row.type, needle),
  );
}

export function filterStocktakesBySearch(
  rows: Stocktake[],
  search: string,
): Stocktake[] {
  const needle = search.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter(
    (row) =>
      matches(row.stocktakeNumber, needle) ||
      matches(row.location?.name, needle) ||
      matches(row.status, needle),
  );
}
