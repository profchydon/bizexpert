import { ICancellationRequest, IOrder, ISubOrder } from "@/types/orders";
import {
  type CancellationInfo,
  type CancellationScope,
  reasonIdFromLabel,
} from "@/utils/order-cancellation";
import {
  subOrderCanCancel,
  allSubOrdersCancelled,
} from "@/utils/cancellationEligibility";
import { getSubOrders } from "../orderContentLines";
import {
  collectPendingCancellationSubOrderIds,
  isSubOrderAwaitingCancellation,
} from "../table/subOrderCancellationStatus";
import type { CancelEmpRow } from "./cancelData";

export type CancellationView = "none" | "requested" | "cancelled" | "declined";

function employeeIdsForSuborderIds(
  order: IOrder,
  suborderIds: string[],
): string[] {
  const subOrders = getSubOrders(order);
  const employeeIds = new Set<string>();

  for (const suborderId of suborderIds) {
    const match = subOrders.find(
      (entry) =>
        entry.id === suborderId ||
        entry.assets?.some((asset) => asset.id === suborderId),
    );
    if (match) {
      employeeIds.add(match.employee_id || match.id);
    }
  }

  return [...employeeIds];
}

function scopeFromRequest(
  request: ICancellationRequest,
  order: IOrder,
): CancellationScope {
  const subOrders = getSubOrders(order);

  if (request.suborder_id) {
    const subOrder = subOrders.find(
      (entry) => entry.id === request.suborder_id,
    );
    const employeeId = subOrder?.employee_id;
    if (employeeId) {
      return { kind: "sub-orders", employeeIds: [employeeId] };
    }
    return { kind: "full" };
  }

  const scopedSuborderIds = Object.keys(request.previous_order_status ?? {});
  if (scopedSuborderIds.length === 0) {
    return { kind: "full" };
  }

  const employeeIds = employeeIdsForSuborderIds(order, scopedSuborderIds);
  if (employeeIds.length === 0) {
    return { kind: "full" };
  }

  if (employeeIds.length >= subOrders.length) {
    return { kind: "full" };
  }

  return { kind: "sub-orders", employeeIds };
}

function mapRequestToInfo(
  request: ICancellationRequest,
  order: IOrder,
  resolution: CancellationInfo["resolution"],
): CancellationInfo {
  return {
    scope: scopeFromRequest(request, order),
    reasonId: reasonIdFromLabel(request.reason),
    details: request.additional_details ?? undefined,
    requestedBy: request.requested_by?.name ?? order.ordered_by ?? "Customer",
    requestedAt: request.created_at,
    resolution,
    declineReason: request.admin_notes ?? undefined,
    selfServe: resolution === "approved" && !request.processed_by,
    unpaid: false,
  };
}

export function deriveCancellationView(order: IOrder): CancellationView {
  const status = order.status?.toLowerCase();
  if (status === "cancelled" || status === "order_cancelled") {
    return "cancelled";
  }

  if (allSubOrdersCancelled(order)) {
    return "cancelled";
  }

  if (
    order.pending_cancellation_request ||
    status === "awaiting_cancellation" ||
    order.cancellation_status?.has_pending_request ||
    collectPendingCancellationSubOrderIds(order).size > 0 ||
    getSubOrders(order).some(isSubOrderAwaitingCancellation)
  ) {
    return "requested";
  }

  const declined = (order.cancellation_requests ?? []).find(
    (request) => request.status?.toLowerCase() === "denied",
  );
  if (declined) return "declined";

  return "none";
}

export function deriveCancellationInfo(order: IOrder): CancellationInfo | null {
  const view = deriveCancellationView(order);

  if (view === "requested") {
    const pending =
      order.pending_cancellation_request ??
      (order.cancellation_requests ?? []).find(
        (request) => request.status?.toLowerCase() === "pending",
      );
    if (pending) return mapRequestToInfo(pending, order, "pending");
  }

  if (view === "declined") {
    const declined = (order.cancellation_requests ?? []).find(
      (request) => request.status?.toLowerCase() === "denied",
    );
    if (declined) return mapRequestToInfo(declined, order, "declined");
  }

  if (view === "cancelled") {
    const approved = (order.cancellation_requests ?? []).find((request) =>
      ["approved", "completed"].includes(request.status?.toLowerCase() ?? ""),
    );
    if (approved) return mapRequestToInfo(approved, order, "approved");
  }

  return null;
}

export function canCancelSubOrder(
  employee: CancelEmpRow,
  order: IOrder,
): boolean {
  const subOrder = getSubOrders(order).find(
    (entry) => (entry.employee_id || entry.id) === employee.id,
  );
  return subOrder ? subOrderCanCancel(subOrder) : false;
}

export function totalItems(employees: CancelEmpRow[]): number {
  return employees.reduce((sum, employee) => sum + employee.items.length, 0);
}

export function subOrderForEmployee(
  order: IOrder,
  employeeId: string,
): ISubOrder | undefined {
  return getSubOrders(order).find(
    (entry) => entry.employee_id === employeeId || entry.id === employeeId,
  );
}
