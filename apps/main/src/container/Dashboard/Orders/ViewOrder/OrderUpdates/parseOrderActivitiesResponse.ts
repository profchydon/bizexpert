import { OrderActivity } from "@/api/baseQueries/companiesApi/ordersApi/getOrderActivities";

export interface OrderActivitiesPage {
  activities: OrderActivity[];
  currentPage: number;
  lastPage: number;
  total: number;
}

export function parseOrderActivitiesResponse(
  response?: ServerResponse<{
    data?: {
      activities?: OrderActivity[];
    };
    current_page?: number;
    last_page?: number;
    total?: number;
  }> | null,
  fallbackPage = 1,
): OrderActivitiesPage {
  const payload = response?.data;
  return {
    activities: payload?.data?.activities ?? [],
    currentPage: payload?.current_page ?? fallbackPage,
    lastPage: Math.max(1, payload?.last_page ?? 1),
    total: payload?.total ?? payload?.data?.activities?.length ?? 0,
  };
}
