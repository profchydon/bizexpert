import type { IInStorageOrdersParams } from "@/types/storageOrdersApi";
import { clampOrdersPageSize } from "../constants/ordersTabConstants";
import type { OrderDirection } from "../types/storage";

export type OrdersStatusTab = "active" | "completed";

export const ACTIVE_ORDER_STATUSES = [
  "awaiting_response",
  "in_progress",
] as const;

export const ACTIVE_ORDER_STATUS_QUERY = ACTIVE_ORDER_STATUSES.join(",");

export function mapMovementToApiDirection(
  movement: OrderDirection | "all",
): string | undefined {
  if (movement === "inbound") return "into_storage";
  if (movement === "outbound") return "out_of_storage";
  return undefined;
}

interface BuildOrdersParamsInput {
  statusTab: OrdersStatusTab;
  movement: OrderDirection | "all";
  page: number;
  pageSize: number;
  search?: string;
}

export function buildInStorageOrdersParams({
  statusTab,
  movement,
  page,
  pageSize,
  search,
}: BuildOrdersParamsInput): IInStorageOrdersParams {
  const params: IInStorageOrdersParams = {
    page,
    per_page: clampOrdersPageSize(pageSize),
  };

  const query = search?.trim();
  if (query) params.search = query;

  const direction = mapMovementToApiDirection(movement);
  if (direction) params.direction = direction;

  params.status =
    statusTab === "completed" ? "completed" : ACTIVE_ORDER_STATUS_QUERY;

  return params;
}

export function buildInStorageOrdersCountParams(
  status: string,
  direction?: string,
): IInStorageOrdersParams {
  const params: IInStorageOrdersParams = {
    status,
    per_page: 1,
    page: 1,
  };

  if (direction) params.direction = direction;

  return params;
}
