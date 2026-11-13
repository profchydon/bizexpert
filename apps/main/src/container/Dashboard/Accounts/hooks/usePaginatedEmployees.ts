"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import type { IEmployees } from "@/types/employees";
import { filterEmployeesByCountry } from "../utils/filterEmployeesByCountry";
import { mergeEmployeePages } from "../utils/mergeEmployeePages";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";

export const WIZARD_EMPLOYEES_PAGE_SIZE = 10;

type Options = {
  country?: string | null;
  filterByCountry?: boolean;
};

export function usePaginatedEmployees(
  search: string,
  enabled: boolean,
  options?: Options,
) {
  const companyId = useWorkspaceCompanyId();
  const [page, setPage] = useState(1);
  const [employees, setEmployees] = useState<IEmployees[]>([]);
  const [debouncedSearch] = useDebounce(search.trim(), 400);
  const filterByCountry = options?.filterByCountry ?? false;
  const normalizedCountry = options?.country?.trim() || null;
  const querySearch =
    debouncedSearch || (filterByCountry ? normalizedCountry : null);

  useEffect(() => {
    setPage(1);
    setEmployees([]);
  }, [debouncedSearch, enabled, filterByCountry, normalizedCountry]);

  const query = useGetEmployeesQuery(
    {
      companyId: companyId!,
      params: {
        page,
        per_page: WIZARD_EMPLOYEES_PAGE_SIZE,
        search: querySearch || null,
      },
    },
    {
      skip: !enabled || !companyId || (filterByCountry && !normalizedCountry),
    },
  );

  const payload = query.currentData?.data;
  const lastPage = payload?.last_page ?? 1;
  const hasMore = page < lastPage;
  const filteredPage = useMemo(() => {
    const rows = payload?.data ?? [];
    return filterByCountry && normalizedCountry
      ? filterEmployeesByCountry(rows, normalizedCountry)
      : rows;
  }, [filterByCountry, normalizedCountry, payload?.data]);

  useEffect(() => {
    if (!enabled || !payload?.data) return;
    if (filterByCountry && !normalizedCountry) return;
    setEmployees((current) => mergeEmployeePages(current, filteredPage, page));
  }, [
    enabled,
    filterByCountry,
    filteredPage,
    normalizedCountry,
    page,
    payload?.data,
  ]);

  const loadMore = useCallback(() => {
    if (!hasMore || query.isFetching) return;
    setPage((current) => current + 1);
  }, [hasMore, query.isFetching]);

  return {
    employees,
    hasMore,
    isError: query.isError,
    isFetching: query.isFetching,
    isInitialLoading: query.isFetching && employees.length === 0,
    isLoadingMore: query.isFetching && employees.length > 0,
    loadMore,
    requiresCountry: filterByCountry && !normalizedCountry,
  };
}
