import { IEquipment } from "@/types/equipments";
import { IOrder, ISubOrder } from "@/types/orders";
import { joinLabelParts } from "@/components/Drawers/IndividualEmployee/slideoutData";
import {
  assetCustomerPrice,
  subOrderCustomerAmount,
} from "./subOrderCustomerPricing";
import { cancelAssetItem } from "./cancel/cancelAssetItem";
import type { CancelEmployeeItem } from "./cancel/cancelData";

type SubOrderDetails = {
  from?: {
    id?: string;
    first_name?: string;
    last_name?: string;
  };
  to?: {
    id?: string;
    first_name?: string;
    last_name?: string;
  };
};

export function subOrderDetails(
  subOrder?: ISubOrder,
): SubOrderDetails | undefined {
  return subOrder?.order_details as SubOrderDetails | undefined;
}

export function subOrderEmployeeId(subOrder: ISubOrder): string {
  const details = subOrderDetails(subOrder);
  return (
    subOrder.employee_id ||
    (subOrder as { user_id?: string }).user_id ||
    details?.from?.id ||
    subOrder.equipment?.assignee?.id ||
    subOrder.id
  );
}

export function isOfficeSubOrder(subOrder?: ISubOrder): boolean {
  return subOrder?.recipient_type === "office" || Boolean(subOrder?.office_id);
}

export function subOrderRecipientSubtitle(subOrder: ISubOrder): string {
  if (isOfficeSubOrder(subOrder)) {
    return subOrder.contact_name?.trim()
      ? `Contact: ${subOrder.contact_name.trim()}`
      : "";
  }
  return subOrder.job_title || "";
}

export function subOrderRecipientNoun(
  subOrders: ISubOrder[],
  count: number,
): string {
  const word = subOrders.some(isOfficeSubOrder) ? "Recipient" : "Employee";
  return count === 1 ? word : `${word}s`;
}

export function subOrderEmployeeName(subOrder: ISubOrder): string {
  if (isOfficeSubOrder(subOrder)) {
    return subOrder.office_name?.trim() || "Office";
  }
  const details = subOrderDetails(subOrder);
  const fromName =
    `${details?.from?.first_name ?? ""} ${details?.from?.last_name ?? ""}`.trim();
  const employeeName =
    `${subOrder.employee_first_name ?? ""} ${subOrder.employee_last_name ?? ""}`.trim();
  return (
    employeeName ||
    fromName ||
    subOrder.equipment?.assignee?.name?.trim() ||
    "Employee"
  );
}

function equipmentLabel(equipment: IEquipment): string {
  return (
    joinLabelParts(equipment.title, equipment.make, equipment.model) ||
    equipment.title ||
    "Device"
  );
}

export function subOrderCancelItems(
  subOrder: ISubOrder,
  canCancel: boolean,
  subOrderCancelled: boolean,
): CancelEmployeeItem[] {
  const employeeId = subOrderEmployeeId(subOrder);
  const amount = subOrderCustomerAmount(subOrder);
  const assets = subOrder.assets ?? [];

  if (assets.length > 0) {
    const perDeviceFallback =
      assets.length > 0 ? amount / assets.length : amount;
    return assets.map((asset) =>
      cancelAssetItem(
        asset,
        employeeId,
        assetCustomerPrice(asset) || perDeviceFallback,
        subOrder.status,
        canCancel,
        subOrderCancelled,
      ),
    );
  }

  const equipment = subOrder.equipment;
  if (equipment) {
    return [
      {
        id: equipment.id || subOrder.id,
        lineId: subOrder.id,
        employeeId,
        name: equipmentLabel(equipment),
        price: amount,
        fulfillmentStage: subOrder.status,
        cancelled: !canCancel,
        isCancelled: subOrderCancelled,
      },
    ];
  }

  return [
    {
      id: subOrder.id,
      lineId: subOrder.id,
      employeeId,
      name: "Sub-order",
      price: amount,
      fulfillmentStage: subOrder.status,
      cancelled: !canCancel,
      isCancelled: subOrderCancelled,
    },
  ];
}

export function cancelGroupKey(order: IOrder, subOrder: ISubOrder): string {
  return order.type === "offboarding"
    ? subOrderEmployeeId(subOrder)
    : subOrder.id;
}

export function groupSubOrdersByEmployee(
  order: IOrder,
  subOrders: ISubOrder[],
): Map<string, ISubOrder[]> {
  const grouped = new Map<string, ISubOrder[]>();

  for (const subOrder of subOrders) {
    const key = cancelGroupKey(order, subOrder);
    const bucket = grouped.get(key) ?? [];
    bucket.push(subOrder);
    grouped.set(key, bucket);
  }

  return grouped;
}
