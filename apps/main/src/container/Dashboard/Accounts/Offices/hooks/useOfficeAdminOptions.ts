"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetCompanyUsersQuery } from "@/api/baseQueries/companiesApi/employeesApi/getUsers";
import {
  applyAdminCountryScope,
  mergeAdminOptions,
  toOfficeAdminOption,
  type CompanyUserRow,
  type OfficeAdminOption,
} from "../utils/mapAdminOption";
import { useCompanyId } from "./useOfficesServer";

export type { OfficeAdminOption };

export interface OfficeAdminDirectory {
  options: OfficeAdminOption[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  requiresCountry: boolean;
  loadMore: () => void;
  setQuery: (query: string) => void;
}

export function useOfficeAdminOptions(
  skip = false,
  country?: string | null,
  config?: { filterByCountry?: boolean; companyId?: string },
): OfficeAdminDirectory {
  const workspaceCompanyId = useCompanyId();
  const companyId = config?.companyId || workspaceCompanyId;
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query.trim(), 400);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<OfficeAdminOption[]>([]);
  const filterByCountry = config?.filterByCountry ?? true;
  const normalizedCountry = country?.trim() || null;
  const requiresCountry = filterByCountry && !normalizedCountry;

  useEffect(() => {
    setPage(1);
    setOptions([]);
  }, [search, normalizedCountry, companyId]);

  const { data, isLoading, isFetching } = useGetCompanyUsersQuery(
    {
      companyId: companyId as string,
      params: {
        search: search || undefined,
        page,
      },
    },
    { skip: skip || !companyId || requiresCountry },
  );

  useEffect(() => {
    const payload = data?.data;
    if (!payload || requiresCountry) return;
    const incoming = applyAdminCountryScope(
      (payload.data as unknown as CompanyUserRow[])
        .map(toOfficeAdminOption)
        .filter((option) => option.value && option.label),
      normalizedCountry,
      filterByCountry,
    );
    setOptions((current) =>
      mergeAdminOptions(current, incoming, payload.current_page ?? 1),
    );
  }, [data, filterByCountry, normalizedCountry, requiresCountry]);

  const currentPage = data?.data?.current_page ?? 1;
  const lastPage = data?.data?.last_page ?? 1;
  const hasMore = !requiresCountry && currentPage < lastPage;

  return {
    options: requiresCountry ? [] : options,
    isLoading,
    isFetching,
    hasMore,
    requiresCountry,
    loadMore: () => {
      if (hasMore && !isFetching) setPage(currentPage + 1);
    },
    setQuery,
  };
}
