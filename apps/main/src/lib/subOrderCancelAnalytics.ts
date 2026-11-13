import { track } from "@/lib/analytics";

export function trackSubOrderCancelRequested(properties: {
  status: "opened" | "submitted";
  order_id?: string;
  sub_order_id?: string;
}): void {
  track("Sub-Order Cancel Requested", {
    status: properties.status,
    ...(properties.order_id ? { order_id: properties.order_id } : {}),
    ...(properties.sub_order_id
      ? { sub_order_id: properties.sub_order_id }
      : {}),
  });
}
