import { ICancellationStatus, IOrder, ISubOrder } from "@/types/orders";

export const CANCELABLE_ORDER_TYPES = [
  "onboarding",
  "offboarding",
  "storage_to_employee",
  "buy_to_storage",
  "device_refresh",
];

const TERMINAL_ORDER_STATUSES = new Set([
  "completed",
  "cancelled",
  "order_cancelled",
  "awaiting_cancellation",
]);

const SETTLED_SUB_ORDER_STATUSES = new Set([
  "cancelled",
  "order_cancelled",
  "completed",
]);

export function getSubOrdersFromOrder(order?: IOrder): ISubOrder[] {
  const raw = order?.sub_orders;
  if (Array.isArray(raw)) return raw;
  return (raw as { data?: ISubOrder[] } | undefined)?.data ?? [];
}

export function isSettledSubOrder(subOrder?: ISubOrder | null): boolean {
  const status = subOrder?.status?.toLowerCase();
  return status != null && SETTLED_SUB_ORDER_STATUSES.has(status);
}

export function isCancelledSubOrder(subOrder?: ISubOrder | null): boolean {
  const status = subOrder?.status?.toLowerCase();
  return status === "cancelled" || status === "order_cancelled";
}

export function allSubOrdersCancelled(order?: IOrder): boolean {
  const subOrders = getSubOrdersFromOrder(order);
  if (subOrders.length === 0) return false;
  return subOrders.every(isCancelledSubOrder);
}

export function deriveOrderDisplayStatus(order: IOrder): string {
  if (allSubOrdersCancelled(order)) {
    return "cancelled";
  }

  return order.status || "";
}

export function activeSubOrdersFromOrder(order?: IOrder): ISubOrder[] {
  return getSubOrdersFromOrder(order).filter(
    (subOrder) => !isSettledSubOrder(subOrder),
  );
}

export function canCancelFromStatus(
  cancellationStatus?: ICancellationStatus | null,
): boolean {
  return cancellationStatus?.can_cancel === true;
}

export function orderCutoffMessage(order?: IOrder | null): string | null {
  return order?.cancellation_status?.cutoff_message ?? null;
}

export function subOrderCanCancel(subOrder?: ISubOrder | null): boolean {
  if (subOrder?.cancellation_status) {
    return canCancelFromStatus(subOrder.cancellation_status);
  }

  const assets = subOrder?.assets ?? [];
  if (assets.length > 0) {
    return assets.some((asset) =>
      canCancelFromStatus(
        (asset as { cancellation_status?: ICancellationStatus })
          .cancellation_status,
      ),
    );
  }

  return false;
}

export function canCancelOrder(order?: IOrder): boolean {
  return canShowOrderCancelButton(order);
}

export function canShowOrderCancelButton(order?: IOrder): boolean {
  if (!order) return false;

  if (!CANCELABLE_ORDER_TYPES.includes(order.type || "")) {
    return false;
  }

  if (TERMINAL_ORDER_STATUSES.has(order.status?.toLowerCase() ?? "")) {
    return false;
  }

  if (order.cancellation_status) {
    return order.cancellation_status.can_cancel === true;
  }

  const subOrders = activeSubOrdersFromOrder(order);
  if (subOrders.length === 0) return false;

  return subOrders.every((subOrder) => subOrderCanCancel(subOrder));
}

export function hasUncancellableDevices(order?: IOrder): boolean {
  if (!order) return true;

  if (order.cancellation_status?.can_cancel === true) {
    return false;
  }

  if (order.cancellation_status?.can_cancel === false) {
    return true;
  }

  const subOrders = activeSubOrdersFromOrder(order);
  if (subOrders.length === 0) return false;

  return subOrders.some((subOrder) => !subOrderCanCancel(subOrder));
}

export function hasAnyCancellableSubOrder(order?: IOrder): boolean {
  return getSubOrdersFromOrder(order).some((subOrder) =>
    subOrderCanCancel(subOrder),
  );
}

export function isInstantCancellation(order?: IOrder): boolean {
  if (!order?.cancellation_status?.can_cancel) return false;
  if (order.cancellation_status.has_pending_request) return false;

  if (typeof order.cancellation_status.instant === "boolean") {
    return order.cancellation_status.instant;
  }

  if (order.cancellation_status.cutoff_reason) return false;

  return true;
}

export function orderCancelUnavailableMessage(order?: IOrder): string | null {
  const fromApi = orderCutoffMessage(order);
  if (fromApi) return fromApi;

  if (
    order?.cancellation_status?.can_cancel === false ||
    hasUncancellableDevices(order)
  ) {
    return order?.type === "offboarding"
      ? "A vendor already has these devices, so this order can no longer be cancelled. Message Rayda on this order to ask for them back."
      : "A vendor has already accepted this order and started work on it, so it can no longer be cancelled. Message Rayda on this order if you need to change it.";
  }

  return null;
}
