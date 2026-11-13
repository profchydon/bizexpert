const COMPLETED_ALIASES = new Set([
  "order_delivered",
  "delivered",
  "collection_completed",
  "picked_up",
  "sold",
]);

export function aliasOrderStatus(status?: string | null) {
  const normalized = status?.toLowerCase();
  if (normalized === "order_cancelled") return "cancelled";
  if (normalized && COMPLETED_ALIASES.has(normalized)) return "completed";
  return status;
}
