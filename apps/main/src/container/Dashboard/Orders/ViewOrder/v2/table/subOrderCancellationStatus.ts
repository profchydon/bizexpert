import { ICancellationRequest, IOrder, ISubOrder } from "@/types/orders";
import { getSubOrders } from "../orderContentLines";
import type { CancellationInfo } from "@/utils/order-cancellation";
import { displayStatusForCompletedOfficeOrder } from "../officeCompletedStatus";

type CancellationView = "none" | "requested" | "cancelled" | "declined";

function isPendingRequest(
  request?: ICancellationRequest | null,
): request is ICancellationRequest {
  return request?.status?.toLowerCase() === "pending";
}

export function isSubOrderAwaitingCancellation(row: ISubOrder): boolean {
  const status = row.status?.toLowerCase();
  if (status === "awaiting_cancellation") return true;

  if (isPendingRequest(row.pending_cancellation_request)) return true;
  if (row.cancellation_status?.has_pending_request) return true;

  const assets = row.assets ?? [];
  return assets.some((asset) => {
    const entry = asset as {
      status?: string;
      pending_cancellation_request?: ICancellationRequest | null;
      cancellation_status?: { has_pending_request?: boolean };
    };
    if (entry.status?.toLowerCase() === "awaiting_cancellation") return true;
    if (isPendingRequest(entry.pending_cancellation_request)) return true;
    if (entry.cancellation_status?.has_pending_request) return true;
    return false;
  });
}

export function collectPendingCancellationSubOrderIds(
  order: IOrder,
): Set<string> {
  const ids = new Set<string>();
  const seenRequestIds = new Set<string>();

  const candidates = [
    ...(order.pending_cancellation_request
      ? [order.pending_cancellation_request]
      : []),
    ...(order.cancellation_requests ?? []).filter((request) =>
      isPendingRequest(request),
    ),
  ];

  for (const request of candidates) {
    if (seenRequestIds.has(request.id)) continue;
    seenRequestIds.add(request.id);

    if (request.suborder_id) {
      ids.add(request.suborder_id);
    }

    for (const suborderId of Object.keys(request.previous_order_status ?? {})) {
      ids.add(suborderId);
    }
  }

  return ids;
}

export function isSubOrderInCancellationScope(
  row: ISubOrder,
  pendingSubOrderIds: Set<string>,
): boolean {
  if (pendingSubOrderIds.size === 0) return false;
  if (pendingSubOrderIds.has(row.id)) return true;

  const assets = row.assets ?? [];
  return assets.some(
    (asset) => asset.id != null && pendingSubOrderIds.has(asset.id),
  );
}

function isRowInCancellationInfoScope(
  row: ISubOrder,
  info: CancellationInfo,
  order: IOrder,
): boolean {
  if (info.scope.kind === "full") return true;

  if (info.scope.kind === "sub-orders") {
    const employeeKey = row.employee_id || row.id;
    return info.scope.employeeIds.includes(employeeKey);
  }

  if (info.scope.kind === "items") {
    const assetIds = new Set(info.scope.itemIds);
    return (row.assets ?? []).some(
      (asset) => asset.id != null && assetIds.has(asset.id),
    );
  }

  const pendingIds = collectPendingCancellationSubOrderIds(order);
  return isSubOrderInCancellationScope(row, pendingIds);
}

export function resolveSubOrderDisplayStatus(
  row: ISubOrder,
  order?: IOrder,
  options?: {
    cancellationView?: CancellationView;
    cancellationInfo?: CancellationInfo | null;
    pendingSubOrderIds?: Set<string>;
  },
): string {
  if (isSubOrderAwaitingCancellation(row)) {
    return "awaiting_cancellation";
  }

  if (!order) return row.status || "";

  const pendingSubOrderIds =
    options?.pendingSubOrderIds ?? collectPendingCancellationSubOrderIds(order);
  if (isSubOrderInCancellationScope(row, pendingSubOrderIds)) {
    return "awaiting_cancellation";
  }

  const view = options?.cancellationView;
  const info = options?.cancellationInfo;
  if (view === "requested" && info?.resolution === "pending") {
    if (isRowInCancellationInfoScope(row, info, order)) {
      return "awaiting_cancellation";
    }
  }

  return (
    displayStatusForCompletedOfficeOrder(row.status, order, row) ||
    row.status ||
    ""
  );
}

export function subOrdersWithPendingCancellation(order: IOrder): ISubOrder[] {
  return getSubOrders(order).filter((row) =>
    isSubOrderAwaitingCancellation(row),
  );
}
