import type { OrderLevelStatus } from "@/components/application/order-status/order-status-badge";

export function mapApiOrderStatus(status?: string | null): OrderLevelStatus {
  switch (status?.toLowerCase()) {
    case "awaiting":
      return "pending-payment";
    case "pending":
    case "order_placed":
      return "pending";
    case "verification_pending":
      return "verification-pending";
    case "completed":
    case "order_delivered":
    case "delivered":
    case "collection_completed":
    case "picked_up":
    case "sold":
      return "completed";
    case "cancelled":
    case "order_cancelled":
      return "cancelled";
    case "in_progress":
    case "product_setup":
    case "order_in_transit":
    case "in_transit":
    case "pending_pickup":
    case "in_storage":
    case "scheduled":
    case "details_verified":
    case "details_updated":
    case "details_auto_verified":
    case "awaiting_cancellation":
    default:
      return "in-progress";
  }
}
