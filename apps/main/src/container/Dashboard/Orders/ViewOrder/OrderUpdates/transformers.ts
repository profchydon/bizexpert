import { IOrder } from "@/types/orders";
import { UnifiedActivity } from "./types";
import { transformCancellationRequest } from "./transformCancellation";
import { transformTrackingEvent } from "./transformTracking";

export function transformOrderDataToActivities(
  order: IOrder,
): UnifiedActivity[] {
  const activities: UnifiedActivity[] = [];

  const cancellationRequests = Array.isArray(order?.cancellation_requests)
    ? order.cancellation_requests
    : [];

  cancellationRequests.forEach((request) => {
    activities.push(transformCancellationRequest(request, order));
  });

  const subOrders = Array.isArray(order?.sub_orders) ? order.sub_orders : [];

  subOrders.forEach((subOrder) => {
    const trackingEvents = Array.isArray(subOrder.tracking_events)
      ? subOrder.tracking_events
      : [];

    trackingEvents.forEach((event) => {
      const activity = transformTrackingEvent(event, subOrder, order);
      if (activity) {
        activities.push(activity);
      }
    });
  });

  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return activities;
}
