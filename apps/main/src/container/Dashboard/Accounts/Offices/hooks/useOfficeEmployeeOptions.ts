"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetEmployeesQuery } from "@/api/baseQueries/companiesApi/employeesApi/getEmployees";
import type { OfficeScopedEmployee } from "../utils/mapOfficeMembers";
import { syncOpenPagedRows } from "../utils/mergePagedRows";
import { useCompanyId } from "./useOfficesServer";

export function useOfficeEmployeeOptions(region: string, isOpen: boolean) {
  const companyId = useCompanyId();
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query.trim(), 400);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OfficeScopedEmployee[]>([]);

  useEffect(() => {
    setPage(1);
  }, [search, region]);

  const { data, isFetching } = useGetEmployeesQuery(
    {
      companyId: companyId as string,
      params: { per_page: 15, search: search || region, page },
    },
    { skip: !isOpen || !companyId },
  );

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setQuery("");
    }
    const payload = data?.data;
    setRows((current) =>
      syncOpenPagedRows(
        isOpen,
        current,
        payload ? ((payload.data ?? []) as OfficeScopedEmployee[]) : undefined,
        payload?.current_page,
      ),
    );
  }, [data, isOpen]);

  const currentPage = data?.data?.current_page ?? 1;
  const lastPage = data?.data?.last_page ?? 1;
  const hasMore = currentPage < lastPage;

  return {
    rows,
    setQuery,
    hasMore,
    isFetching,
    loadMore: () => {
      if (hasMore && !isFetching) setPage(currentPage + 1);
    },
  };
}
