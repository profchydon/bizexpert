import type { StocktakeStatus, StockTransferStatus } from "@/types/bizexpert";

const TRANSFER_LABELS: Record<StockTransferStatus, string> = {
  pending: "Pending",
  in_transit: "In transit",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STOCKTAKE_LABELS: Record<StocktakeStatus, string> = {
  draft: "Draft",
  counting: "Counting",
  pending_approval: "Pending approval",
  applied: "Applied",
  cancelled: "Cancelled",
};

export function formatTransferStatus(status: string): string {
  return (
    TRANSFER_LABELS[status as StockTransferStatus] ?? status.replace(/_/g, " ")
  );
}

export function formatStocktakeStatus(status: string): string {
  return (
    STOCKTAKE_LABELS[status as StocktakeStatus] ?? status.replace(/_/g, " ")
  );
}

export function formatMovementType(type: string): string {
  return type.replace(/_/g, " ");
}

export function isInTransitTransfer(status: string): boolean {
  return status === "in_transit";
}

export function isOpenStocktake(status: string): boolean {
  return status === "draft" || status === "counting";
}

export function isPendingStocktake(status: string): boolean {
  return status === "pending_approval";
}

export function toQuantityNumber(
  value: number | string | null | undefined,
): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}
