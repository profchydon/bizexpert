import { IOrder, ISubOrder } from "@/types/orders";

export const NON_UPDATABLE_STATUSES = new Set<string>([
  "completed",
  "awaiting",
  "delivered",
  "order_delivered",
  "collection_completed",
  "picked_up",
  "sold",
  "in_storage",
]);

export function getSelectDisabledReason(
  row: ISubOrder | undefined,
  order: IOrder | undefined,
): string | null {
  if (NON_UPDATABLE_STATUSES.has(order?.status?.toLowerCase() || "")) {
    return "Signature can no longer be changed once the order is in progress or completed.";
  }
  if (row?.type === "storage") {
    return "Storage items are handled by Rayda and don't require a recipient signature.";
  }
  if (NON_UPDATABLE_STATUSES.has(row?.status?.toLowerCase() || "")) {
    return "This item's status can no longer be updated.";
  }
  return null;
}

export function getVerifyDisabledReason(
  isPending: boolean,
  hasVerifiableAddress: boolean,
): string | null {
  if (!isPending) return null;
  if (!hasVerifiableAddress) {
    return "This item has no address that can be verified.";
  }
  return null;
}
