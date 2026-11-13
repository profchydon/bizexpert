"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetOrdersQuery } from "@/api/baseQueries/companiesApi/ordersApi/getOrders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { applyTablePageParam } from "@/utils/tableListPage";
import {
  isOrdersListAwaitingResults,
  isOrdersListRefreshing,
} from "@/hooks/order/ordersListPending";
import {
  normalizeOrderListFilters,
  orderListFilterQuery,
  orderListFiltersKey,
  readOrderListFilters,
  writeOrderListFilters,
  type OrderListFilters,
} from "@/utils/orderListFilters";

const ORDERS_PER_PAGE = 15;

function replaceListSearch(params: URLSearchParams) {
  const query = params.toString();
  const url = query
    ? `${window.location.pathname}?${query}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}

export const useOrdersQuery = (options?: { search?: string | null }) => {
  const companyId = useWorkspaceCompanyId();
  const searchParams = useSearchParams();
  const { page, setPage } = useTablePageQuery();
  const urlFilters = readOrderListFilters(searchParams);
  const urlFiltersKey = orderListFiltersKey(urlFilters);
  const [pendingFilters, setPendingFilters] = useState<OrderListFilters | null>(
    null,
  );
  const filters = pendingFilters ?? urlFilters;
  const filterQuery = orderListFilterQuery(filters);
  const search = options?.search?.trim() || undefined;

  useEffect(() => {
    setPendingFilters(null);
  }, [urlFiltersKey]);

  const query = useGetOrdersQuery(
    {
      companyId: companyId!,
      params: {
        page,
        per_page: ORDERS_PER_PAGE,
        ...(search ? { search } : {}),
        ...orderListFilterQuery(filters),
      },
    },
    { skip: !companyId },
  );

  const writeFilters = useCallback(
    (next: OrderListFilters) => {
      setPendingFilters(next);
      const params = new URLSearchParams(window.location.search);
      writeOrderListFilters(params, next);
      applyTablePageParam(params, 1);
      replaceListSearch(params);
      setPage(1);
    },
    [setPage],
  );

  const handleApply = useCallback(
    (next: {
      status?: string | null;
      type?: string | null;
      country?: string | null;
      from?: string | null;
      to?: string | null;
    }) => {
      writeFilters(normalizeOrderListFilters(next));
    },
    [writeFilters],
  );

  const reset = useCallback(() => {
    writeFilters({});
  }, [writeFilters]);

  const hasCurrentResults = query.currentData != null;

  return {
    data: query.currentData,
    isLoading: isOrdersListAwaitingResults({
      isUninitialized: query.isUninitialized,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      hasCurrentResults,
    }),
    isRefreshing: isOrdersListRefreshing({
      isFetching: query.isFetching,
      hasCurrentResults,
    }),
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    page,
    setPage,
    filters,
    filterQuery,
    handleApply,
    reset,
  };
};
