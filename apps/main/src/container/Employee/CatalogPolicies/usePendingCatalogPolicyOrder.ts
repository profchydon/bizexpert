"use client";

import { useGetEmployeeCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployeeCatalogPolicyOrderRequests";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import {
  approvedCatalogPolicyOrderMessage,
  hasApprovedCatalogPolicyOrder,
  hasPendingCatalogPolicyOrder,
  pendingCatalogPolicyOrderMessage,
} from "./pendingOrder";

export function usePendingCatalogPolicyOrder(catalogId?: string) {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const pendingQuery = useGetEmployeeCatalogPolicyOrderRequestsQuery(
    {
      catalogId: catalogId!,
      companyId: company?.id!,
      params: { page: 1, per_page: 1, status: "pending" },
    },
    { skip: !company?.id || !catalogId },
  );
  const approvedQuery = useGetEmployeeCatalogPolicyOrderRequestsQuery(
    {
      catalogId: catalogId!,
      companyId: company?.id!,
      params: { page: 1, per_page: 1, status: "approved" },
    },
    { skip: !company?.id || !catalogId },
  );
  const hasApprovedOrder = hasApprovedCatalogPolicyOrder(
    approvedQuery.data?.data,
  );

  return {
    approvedOrderMessage: approvedCatalogPolicyOrderMessage,
    hasApprovedOrder,
    hasPendingOrder: hasPendingCatalogPolicyOrder(pendingQuery.data?.data),
    isCheckingPendingOrder: pendingQuery.isFetching || approvedQuery.isFetching,
    orderLocked: hasApprovedOrder,
    pendingOrderMessage: pendingCatalogPolicyOrderMessage,
  };
}
