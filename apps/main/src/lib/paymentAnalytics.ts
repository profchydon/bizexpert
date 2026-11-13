import { track } from "@/lib/analytics";

export function trackOrderPaymentCancelled(properties?: {
  order_id?: string;
  order_flow?: string;
}): void {
  const payload = {
    ...(properties?.order_id ? { order_id: properties.order_id } : {}),
    ...(properties?.order_flow ? { order_flow: properties.order_flow } : {}),
  };
  track(
    "Order Payment Cancelled",
    Object.keys(payload).length > 0 ? payload : undefined,
  );
}

export function trackOrderPaid(properties?: {
  order_id?: string;
  order_flow?: string;
}): void {
  const payload = {
    ...(properties?.order_id ? { order_id: properties.order_id } : {}),
    ...(properties?.order_flow ? { order_flow: properties.order_flow } : {}),
  };
  track("Order Paid", Object.keys(payload).length > 0 ? payload : undefined);
}

export function paymentRedirectProperties(
  orderFlow: string,
  orderId: string,
): { order_id?: string; order_flow: string } {
  return {
    ...(orderId ? { order_id: orderId } : {}),
    order_flow: orderFlow,
  };
}
