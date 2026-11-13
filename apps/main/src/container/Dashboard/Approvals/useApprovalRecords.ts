"use client";

import { useMemo } from "react";
import { useGetCatalogPolicyOrderRequestApprovalStatsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequestApprovalStats";
import { useGetCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequests";
import { useGetPendingCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getPendingCatalogPolicyOrderRequests";
import { orderRequestListToRecords } from "./apiAdapters";
import type { ApprovalFilterTab } from "./types";
import {
  approvalStatsToCounts,
  computeApprovalCounts,
  recordsForApprovalTab,
} from "./utils";
import { getApprovalListQuerySkips } from "./approvalRecordQuery";

interface UseApprovalRecordsArgs {
  activeTab: ApprovalFilterTab;
  companyId?: string;
  queryParams: {
    page: number;
    per_page: number;
    search: string | null;
  };
}

export function useApprovalRecords({
  activeTab,
  companyId,
  queryParams,
}: UseApprovalRecordsArgs) {
  const querySkips = getApprovalListQuerySkips({ activeTab, companyId });
  const pendingRequestsQuery = useGetPendingCatalogPolicyOrderRequestsQuery(
    {
      companyId: companyId!,
      params: queryParams,
    },
    { skip: querySkips.skipPending },
  );
  const allRequestsQuery = useGetCatalogPolicyOrderRequestsQuery(
    {
      companyId: companyId!,
      params: queryParams,
    },
    { skip: querySkips.skipAll },
  );
  const approvalStatsQuery = useGetCatalogPolicyOrderRequestApprovalStatsQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );
  const pendingRecords = useMemo(
    () => orderRequestListToRecords(pendingRequestsQuery.data?.data),
    [pendingRequestsQuery.data?.data],
  );
  const allRecords = useMemo(
    () => orderRequestListToRecords(allRequestsQuery.data?.data),
    [allRequestsQuery.data?.data],
  );
  const records = useMemo(
    () => recordsForApprovalTab({ allRecords, pendingRecords, tab: activeTab }),
    [activeTab, allRecords, pendingRecords],
  );
  const activePayload =
    activeTab === "awaiting"
      ? pendingRequestsQuery.data?.data
      : allRequestsQuery.data?.data;
  const counts = approvalStatsToCounts(
    approvalStatsQuery.data?.data?.stats,
  ) ?? {
    ...computeApprovalCounts(allRecords),
    awaiting: pendingRecords.length,
  };

  return {
    activePayload,
    counts,
    isLoading:
      activeTab === "awaiting"
        ? pendingRequestsQuery.isLoading
        : allRequestsQuery.isLoading,
    records,
  };
}
