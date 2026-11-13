export const CANCELLATION_REASONS = [
  "Ordered by mistake",
  "No longer need the item(s)",
  "Delivery timeline too long",
  "Need to change specifications",
  "Budget constraints",
  "Other",
];

export function getStatusBadgeVariant(status: string) {
  const statusLower = status?.toLowerCase() || "";
  if (statusLower === "completed" || statusLower === "delivered") {
    return "bg-green-50 text-green-700";
  }
  if (statusLower === "cancelled") {
    return "bg-red-50 text-red-700";
  }
  if (statusLower === "in_progress") {
    return "bg-blue-50 text-blue-700";
  }
  return "bg-yellow-50 text-yellow-700";
}

export function formatStatus(status: string) {
  if (!status) return "Pending";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
