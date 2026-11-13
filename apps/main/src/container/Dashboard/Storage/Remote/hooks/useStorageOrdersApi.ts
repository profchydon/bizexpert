"use client";

import { useMemo } from "react";
import { useGetInStorageOrdersQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageOrders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { currentQueryList } from "@/utils/currentQueryList";
import { isQueryResultPending } from "@/utils/isQueryResultPending";
import type { OrdersStatusTab } from "../utils/buildInStorageOrdersParams";
import {
  buildInStorageOrdersCountParams,
  buildInStorageOrdersParams,
} from "../utils/buildInStorageOrdersParams";
import { mapInStorageOrder } from "../utils/mapInStorageOrder";
import type { OrderDirection } from "../types/storage";
import { sumActiveOrderTotals } from "./useStorageOrdersCounts";

export { useStorageOrdersCounts } from "./useStorageOrdersCounts";

interface UseStorageOrdersApiInput {
  debouncedSearch: string;
  statusTab: OrdersStatusTab;
  movement: OrderDirection | "all";
  page: number;
  pageSize: number;
}

export function useStorageOrdersApi({
  debouncedSearch,
  statusTab,
  movement,
  page,
  pageSize,
}: UseStorageOrdersApiInput) {
  const companyId = useWorkspaceCompanyId() ?? "";
  const skipList = !companyId || movement === "service";
  const search = debouncedSearch.trim();
  const hasSearch = Boolean(search);

  const listParams = useMemo(
    () =>
      buildInStorageOrdersParams({
        statusTab,
        movement,
        page,
        pageSize,
        search: hasSearch ? search : undefined,
      }),
    [hasSearch, movement, page, pageSize, search, statusTab],
  );

  const listQuery = useGetInStorageOrdersQuery(
    { companyId, params: listParams },
    { skip: skipList },
  );

  const orderRows = currentQueryList(listQuery.currentData);
  const orders = useMemo(() => orderRows.map(mapInStorageOrder), [orderRows]);

  const awaitingCountQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams(
        "awaiting_response",
        listParams.direction,
      ),
    },
    { skip: !companyId || movement === "service" },
  );

  const inProgressCountQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams(
        "in_progress",
        listParams.direction,
      ),
    },
    { skip: !companyId || movement === "service" },
  );

  const completedCountQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams(
        "completed",
        listParams.direction,
      ),
    },
    { skip: !companyId || movement === "service" },
  );

  const activeTotal = sumActiveOrderTotals([
    awaitingCountQuery.data?.data?.total,
    inProgressCountQuery.data?.data?.total,
  ]);
  const completedTotal = completedCountQuery.data?.data?.total ?? 0;

  const orderPage = listQuery.currentData?.data;
  const pagination = {
    total: orderPage?.total ?? 0,
    currentPage: orderPage?.current_page ?? page,
    lastPage: orderPage?.last_page ?? 1,
    perPage: orderPage?.per_page ?? pageSize,
  };

  return {
    orders,
    pagination,
    tabCounts: {
      active: activeTotal,
      completed: completedTotal,
    },
    isLoading: skipList
      ? false
      : isQueryResultPending({ ...listQuery, hasRows: orders.length > 0 }),
    isError: listQuery.isError,
    refetch: () => void listQuery.refetch(),
    isServiceFilter: movement === "service",
  };
}
