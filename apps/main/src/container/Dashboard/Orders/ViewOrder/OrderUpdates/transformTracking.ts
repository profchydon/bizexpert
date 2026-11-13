import { IOrder, ITrackingEvent, ISubOrder } from "@/types/orders";
import { UnifiedActivity } from "./types";
import { getInitials, formatStatusText } from "./utils";

const STATUS_MAP: Record<string, { actionTitle: string; message: string }> = {
  order_placed: {
    actionTitle: "Order placed",
    message: "Your order has been placed successfully.",
  },
  order_confirmed: {
    actionTitle: "Order confirmed",
    message: "Your order has been confirmed.",
  },
  pending: {
    actionTitle: "Processing",
    message: "Your order is being processed.",
  },
  in_progress: {
    actionTitle: "In progress",
    message: "Your order is in progress.",
  },
  shipped: {
    actionTitle: "Shipped",
    message: "Your order has been shipped.",
  },
  delivered: {
    actionTitle: "Delivered",
    message: "Your order has been delivered.",
  },
  completed: {
    actionTitle: "Completed",
    message: "Your order has been completed.",
  },
  cancelled: {
    actionTitle: "Cancelled",
    message: "Your order has been cancelled.",
  },
};

export function transformTrackingEvent(
  event: ITrackingEvent,
  subOrder: ISubOrder,
  order: IOrder,
): UnifiedActivity | null {
  if (event.status === "awaiting_cancellation") {
    return null;
  }

  if (event.status === "cancelled" && order.status !== "cancelled") {
    return null;
  }

  const equipment = subOrder.equipment;
  const equipmentTitle = equipment?.title || "Item";
  const equipmentImage = equipment?.image_url;

  const statusInfo = STATUS_MAP[event.status] || {
    actionTitle: formatStatusText(event.status),
    message: `Order status updated to ${formatStatusText(event.status)}.`,
  };

  return {
    id: event.id,
    type: "tracking_update",
    headerTitle: equipmentTitle,
    actionTitle: statusInfo.actionTitle,
    actionTitleColor: "default",
    message: statusInfo.message,
    avatar: {
      type: equipmentImage ? "image" : "initials",
      value: equipmentImage ? equipmentTitle : getInitials(equipmentTitle),
      imageUrl: equipmentImage || undefined,
    },
    timestamp: event.created_at,
    equipmentInfo:
      equipment && equipment.id
        ? {
            id: equipment.id,
            title: equipmentTitle,
            imageUrl: equipmentImage || undefined,
          }
        : undefined,
  };
}
