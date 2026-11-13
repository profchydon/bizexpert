import { IOrder, ISubOrder } from "@/types/orders";

export const NON_UPDATABLE_STATUSES = [
  "completed",
  "awaiting",
  "delivered",
  "order_delivered",
  "collection_completed",
  "picked_up",
  "sold",
  "in_storage",
];

export function isSubOrderUpdatable(sub: ISubOrder): boolean {
  const statusLower = sub.status?.toLowerCase() || "";
  return !NON_UPDATABLE_STATUSES.includes(statusLower);
}

export function getEmployeeNameFromSubOrder(sub: any, order?: IOrder): string {
  const onboardingName =
    `${sub.employee_first_name || ""} ${sub.employee_last_name || ""}`.trim();
  if (onboardingName) return onboardingName;

  if (order?.type === "offboarding") {
    if (sub.type === "reassign" && sub.order_details?.to) {
      const reassignName =
        `${sub.order_details.to.first_name || ""} ${sub.order_details.to.last_name || ""}`.trim();
      if (reassignName) return reassignName;
    }

    if (sub.type === "storage" && sub.equipment?.assignee?.name) {
      return sub.equipment.assignee.name;
    }

    if (sub.type === "resale") return "Resale";
  }

  if (sub?.equipment?.assignee?.name) {
    return sub.equipment.assignee.name;
  }

  return "N/A";
}

export interface ConfirmDialogData {
  failedSubOrders: any[];
  successSubOrders: any[];
  updatedCount: number;
  totalCount: number;
}

export function buildConfirmDialogData(
  rows: ISubOrder[],
  order?: IOrder,
): ConfirmDialogData {
  const nonUpdatable = rows.filter((sub) => !isSubOrderUpdatable(sub));
  const updatable = rows.filter((sub) => isSubOrderUpdatable(sub));

  return {
    failedSubOrders: nonUpdatable.map((sub: any) => ({
      id: sub.id,
      employee_name: getEmployeeNameFromSubOrder(sub, order),
      status: sub.status,
      reason: NON_UPDATABLE_STATUSES.includes(sub.status?.toLowerCase())
        ? "Already shipped or completed"
        : "Cannot be modified",
    })),
    successSubOrders: updatable.map((sub: any) => ({
      id: sub.id,
      employee_name: getEmployeeNameFromSubOrder(sub, order),
    })),
    updatedCount: rows.length - nonUpdatable.length,
    totalCount: rows.length,
  };
}
