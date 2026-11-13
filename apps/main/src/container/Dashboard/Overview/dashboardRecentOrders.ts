import type { IDashboard, IRecentOrders } from "@/types/dashboard";
import { orderFlowTypeCheck, type OrderFlowType } from "@/types/offboarding";

const OVERVIEW_RECENT_ORDER_LIMIT = 8;

const ORDER_NUMBER_TYPE: Record<string, OrderFlowType> = {
  OFF: "offboarding",
  ONB: "onboarding",
  BTF: "onboarding",
  STE: "storage_to_employee",
  STO: "storage_order",
  DRF: "device_refresh",
  BTS: "buy_to_storage",
};

export function isDashboardRecentOrdersVisible(dashboard?: IDashboard | null) {
  return dashboard?.access?.visibility?.ordering !== false;
}

export function resolveRecentOrderType(
  order: Pick<IRecentOrders, "type" | "order_number">,
): OrderFlowType | null {
  const explicit = order.type?.trim().toLowerCase();

  if (explicit && explicit in orderFlowTypeCheck) {
    return explicit as OrderFlowType;
  }

  const prefix = order.order_number?.split("-")[1]?.toUpperCase();
  return (prefix && ORDER_NUMBER_TYPE[prefix]) || null;
}

export function dashboardRecentOrders(
  dashboard?: IDashboard | null,
): IRecentOrders[] {
  const fromPanel = dashboard?.panels?.ordering?.recent_orders;
  const rows = fromPanel?.length ? fromPanel : (dashboard?.recent_orders ?? []);

  return rows.slice(0, OVERVIEW_RECENT_ORDER_LIMIT).map((order) => ({
    ...order,
    type: resolveRecentOrderType(order),
  }));
}
