"use client";

import { useGetCatalogPolicyOrderRequestApprovalStatsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequestApprovalStats";
import { useLazyGetCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequests";
import { useLazyGetPendingCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getPendingCatalogPolicyOrderRequests";
import { approvalPageSize } from "./pagination";

export function useApprovalListRefresh(companyId?: string) {
  const [getAllRequests] = useLazyGetCatalogPolicyOrderRequestsQuery();
  const [getPendingRequests] =
    useLazyGetPendingCatalogPolicyOrderRequestsQuery();
  const statsQuery = useGetCatalogPolicyOrderRequestApprovalStatsQuery(
    { companyId: companyId! },
    { skip: !companyId },
  );

  return async () => {
    if (!companyId) return;
    const params = { page: 1, per_page: approvalPageSize, search: null };
    await Promise.all([
      getPendingRequests({ companyId, params }, false).unwrap(),
      getAllRequests({ companyId, params }, false).unwrap(),
      statsQuery.refetch(),
    ]);
  };
}
