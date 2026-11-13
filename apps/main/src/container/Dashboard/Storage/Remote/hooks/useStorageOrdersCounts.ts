"use client";

import { useGetInStorageOrdersQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageOrders";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { buildInStorageOrdersCountParams } from "../utils/buildInStorageOrdersParams";

export function sumActiveOrderTotals(totals: Array<number | undefined>) {
  return totals.reduce<number>((sum, total) => sum + (total ?? 0), 0);
}

export function useStorageOrdersCounts() {
  const companyId = useWorkspaceCompanyId() ?? "";

  const awaitingQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams("awaiting_response"),
    },
    { skip: !companyId },
  );

  const inProgressQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams("in_progress"),
    },
    { skip: !companyId },
  );

  const completedQuery = useGetInStorageOrdersQuery(
    {
      companyId,
      params: buildInStorageOrdersCountParams("completed"),
    },
    { skip: !companyId },
  );

  return {
    activeCount: sumActiveOrderTotals([
      awaitingQuery.data?.data?.total,
      inProgressQuery.data?.data?.total,
    ]),
    completedCount: completedQuery.data?.data?.total ?? 0,
    isLoading:
      awaitingQuery.isLoading ||
      inProgressQuery.isLoading ||
      completedQuery.isLoading,
  };
}
