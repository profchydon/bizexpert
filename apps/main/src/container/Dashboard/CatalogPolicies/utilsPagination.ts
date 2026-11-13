import type { CatalogPolicyListParams } from "@/types/catalogPolicy";

import type { RuleFilters, RuleStatusFilter } from "./types";

export const catalogPolicyPageSize = 20;

export function catalogPolicyListParams({
  filters,
  page,
  search,
  statusFilter,
}: {
  filters: RuleFilters;
  page: number;
  search: string;
  statusFilter: RuleStatusFilter;
}): CatalogPolicyListParams {
  return cleanParams({
    page,
    per_page: catalogPolicyPageSize,
    search: search.trim() || undefined,
    ...statusParams(statusFilter),
    level_id: joinValues(filters.levels),
    department_id: joinValues(filters.departments),
    country_id: joinValues(filters.countries),
  });
}

function statusParams(statusFilter: RuleStatusFilter): CatalogPolicyListParams {
  if (statusFilter === "All") return {};
  if (statusFilter === "Archived") return { is_archived: true };
  return {
    is_archived: false,
    status: statusFilter === "Active" ? "active" : "inactive",
  };
}

function joinValues(values: string[]) {
  return values.length ? values.join(",") : undefined;
}

function cleanParams(params: CatalogPolicyListParams): CatalogPolicyListParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as CatalogPolicyListParams;
}

export function getPaginationControls({
  currentPage,
  isLoading = false,
  lastPage,
}: {
  currentPage: number;
  isLoading?: boolean;
  lastPage: number;
}) {
  return {
    canGoNext: currentPage < lastPage && !isLoading,
    canGoPrevious: currentPage > 1 && !isLoading,
  };
}
