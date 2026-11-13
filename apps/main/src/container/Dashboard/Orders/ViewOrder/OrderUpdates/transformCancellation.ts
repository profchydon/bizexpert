import { IOrder, ICancellationRequest } from "@/types/orders";
import { UnifiedActivity } from "./types";
import { getInitials } from "./utils";

function getActivityTypeFromCancellationStatus(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
    case "completed":
      return "cancellation_approved";
    case "denied":
    case "rejected":
      return "cancellation_denied";
    case "pending":
    default:
      return "cancellation_requested";
  }
}

export function transformCancellationRequest(
  request: ICancellationRequest,
  order: IOrder,
): UnifiedActivity {
  const userName = request.requested_by?.name || "Unknown User";
  const userInitials = getInitials(userName);
  const isSubOrder = !!request.suborder_id;
  const orderNumber = order.order_number || request.order_id;

  let headerTitle = orderNumber;
  let actionTitle = "";
  let message = "";
  let actionTitleColor: UnifiedActivity["actionTitleColor"] = "blue";
  let badge: UnifiedActivity["badge"] | undefined;
  let avatarType: UnifiedActivity["avatar"]["type"] = "icon";
  let link: UnifiedActivity["link"] | undefined;

  switch (request.status.toLowerCase()) {
    case "approved":
    case "completed":
      actionTitle = isSubOrder ? "Item cancelled!" : "Order cancelled!";
      message =
        "Use the tracking link in your email or contact support if needed.";
      actionTitleColor = "blue";
      badge = { text: "Cancelled", variant: "destructive" };
      break;
    case "denied":
    case "rejected":
      actionTitle = "Order cancellation denied!";
      message = "Sorry can't cancel order because it is already in progress.";
      actionTitleColor = "red";
      avatarType = "icon";
      break;
    case "pending":
    default:
      headerTitle = "Cancellation request";
      actionTitle = "Cancellation request";
      if (isSubOrder) {
        message = `${userName} requested for cancellation of item`;
      } else {
        message = `${userName} requested for cancellation of this order`;
      }
      link = { text: orderNumber };
      actionTitleColor = "blue";
      badge = { text: "Awaiting cancellation", variant: "pending" };
      avatarType = "initials";
      break;
  }

  return {
    id: request.id,
    type: getActivityTypeFromCancellationStatus(request.status),
    headerTitle,
    actionTitle,
    actionTitleColor,
    message,
    badge,
    avatar: {
      type: avatarType,
      value: avatarType === "initials" ? userInitials : "SYS",
    },
    timestamp: request.created_at,
    link,
  };
}
