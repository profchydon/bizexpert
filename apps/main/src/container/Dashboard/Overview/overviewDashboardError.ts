import type { ICard, IDashboard } from "@/types/dashboard";

const EMPTY_CARDS: ICard = {
  total_employees: 0,
  total_inventory: 0,
  total_active_orders: 0,
  total_active_catalogs: 0,
  total_order_value: 0,
};

export const EMPTY_ENTITY_DASHBOARD: IDashboard = {
  cards: EMPTY_CARDS,
  order_frequency: [],
  equipment_by_country: [],
  equipment_by_category: [],
  recent_orders: [],
  recent_catalogs: [],
  recent_catalog_order_requests: [],
  wallet: {
    wallet: { current_balance: "0", current_limit: "0" },
    wallet_history: {
      daily_snapshot: [],
      weekly_snapshot: [],
      yearly_snapshot: [],
    },
  },
  panels: { overview: EMPTY_CARDS },
};

export function shouldBlockOverviewOnDashboardError(
  isError: boolean,
  activeEntityId: string | null,
): boolean {
  return isError && !activeEntityId;
}

export function resolveOverviewDashboardData(
  dashboardData: IDashboard | undefined,
  isError: boolean,
  activeEntityId: string | null,
): IDashboard | undefined {
  if (dashboardData) return dashboardData;
  if (isError && activeEntityId) return EMPTY_ENTITY_DASHBOARD;
  return undefined;
}
