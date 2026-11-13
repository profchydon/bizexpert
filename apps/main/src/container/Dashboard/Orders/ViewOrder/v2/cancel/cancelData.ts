import { IOrder, ISubOrder } from "@/types/orders";
import {
  isCancelledSubOrder,
  subOrderCanCancel,
} from "@/utils/cancellationEligibility";
import { getSubOrders } from "../orderContentLines";
import { subOrderCustomerAmount } from "../subOrderCustomerPricing";
import {
  cancelGroupKey,
  groupSubOrdersByEmployee,
  subOrderCancelItems,
  subOrderEmployeeId,
  subOrderEmployeeName,
} from "../subOrderIdentity";
import type { CancelIntent } from "./cancelTypes";

export interface CancelEmployeeItem {
  id: string;
  lineId?: string;
  employeeId: string;
  name: string;
  price: number;
  fulfillmentStage: string;
  cancelled?: boolean;
  isCancelled?: boolean;
}

export interface CancelEmpRow {
  id: string;
  employeeId: string;
  name: string;
  status: string;
  items: CancelEmployeeItem[];
  amount: number;
  boxStatus?: boolean;
}

export function isDeviceCancellable(item: CancelEmployeeItem): boolean {
  return !item.cancelled;
}

export function cancellableItems(
  items: CancelEmployeeItem[],
): CancelEmployeeItem[] {
  return items.filter(isDeviceCancellable);
}

export function buildCancelEmployees(order: IOrder): CancelEmpRow[] {
  const subOrders = getSubOrders(order);
  const grouped = groupSubOrdersByEmployee(order, subOrders);

  return Array.from(grouped.entries()).map(([employeeId, rows]) =>
    mapEmployeeGroup(employeeId, rows, order),
  );
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function mapEmployeeGroup(
  employeeId: string,
  subOrders: ISubOrder[],
  order: IOrder,
): CancelEmpRow {
  const lead = subOrders[0];
  const name = subOrderEmployeeName(lead);
  const items = subOrders.flatMap((subOrder) => {
    const canCancel = subOrderCanCancel(subOrder);
    const subOrderCancelled = isCancelledSubOrder(subOrder);
    return subOrderCancelItems(subOrder, canCancel, subOrderCancelled);
  });
  const amount = round(
    subOrders.reduce(
      (sum, subOrder) => sum + subOrderCustomerAmount(subOrder),
      0,
    ),
  );

  return {
    id: employeeId,
    employeeId,
    name,
    status: lead.status,
    items,
    amount,
    boxStatus: order.type === "offboarding",
  };
}

function assetLineId(asset?: unknown): string | null {
  const id = (asset as { asset_order_id?: string | null } | undefined)
    ?.asset_order_id;
  return id ? String(id) : null;
}

export function lineIdsForSubOrder(subOrder: ISubOrder): string[] {
  const lineIds = (subOrder.assets ?? [])
    .map(assetLineId)
    .filter((id): id is string => Boolean(id));
  return lineIds.length ? lineIds : [subOrder.id];
}

export function suborderIdsForIntent(
  order: IOrder,
  intent: CancelIntent,
): string[] | undefined {
  if (intent.type === "order") return undefined;
  if (intent.type === "sub-orders") {
    const ids = getSubOrders(order)
      .filter((sub) => intent.employeeIds.includes(cancelGroupKey(order, sub)))
      .flatMap(lineIdsForSubOrder);
    return ids.length ? Array.from(new Set(ids)) : undefined;
  }
  if (intent.type === "item") {
    const match = getSubOrders(order).find(
      (sub) =>
        subOrderEmployeeId(sub) === intent.employeeId ||
        (sub.assets ?? []).some(
          (asset) => String(asset.id) === intent.itemId,
        ) ||
        sub.equipment?.id === intent.itemId,
    );
    if (!match) return undefined;
    const lineId = assetLineId(
      (match.assets ?? []).find((asset) => String(asset.id) === intent.itemId),
    );
    return [lineId ?? match.id];
  }
  return undefined;
}

export function employeeIdsForIntent(
  intent: CancelIntent,
): string[] | undefined {
  if (intent.type === "sub-orders") return intent.employeeIds;
  if (intent.type === "item") return [intent.employeeId];
  return undefined;
}
