"use client";

import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";

import { useGetCatalogPoliciesQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicies";

import type { RuleFilters, RuleStatusFilter } from "./types";
import { catalogPolicyListParams } from "./utilsPagination";

export function useCatalogPolicyList({
  companyId,
  filters,
  search,
  statusFilter,
}: {
  companyId?: string;
  filters: RuleFilters;
  search: string;
  statusFilter: RuleStatusFilter;
}) {
  const { page, setPage } = useTablePageQuery();
  useResetTablePage(setPage, filters, search, statusFilter);
  const params = catalogPolicyListParams({
    filters,
    page,
    search,
    statusFilter,
  });
  const policiesQuery = useGetCatalogPoliciesQuery(
    { companyId: companyId!, params },
    { skip: !companyId },
  );
  const payload = policiesQuery.data?.data;

  return {
    page,
    policiesQuery,
    pagination: {
      currentPage: payload?.current_page ?? page,
      isLoading: policiesQuery.isFetching,
      lastPage: payload?.last_page ?? 1,
      onPageChange: setPage,
      total: payload?.total ?? 0,
    },
  };
}
