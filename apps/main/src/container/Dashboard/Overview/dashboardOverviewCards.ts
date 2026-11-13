import type { ICard, IDashboard } from "@/types/dashboard";

const EMPTY_CARDS: ICard = {
  total_employees: 0,
  total_inventory: 0,
  total_active_orders: 0,
  total_active_catalogs: 0,
  total_order_value: 0,
};

export function dashboardOverviewCards(dashboard?: IDashboard | null): ICard {
  return dashboard?.panels?.overview ?? dashboard?.cards ?? EMPTY_CARDS;
}
