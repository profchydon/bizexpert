"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetEquipmentsQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getEquipments";
import type { OfficeScopedEquipment } from "../utils/mapOfficeMembers";
import { syncOpenPagedRows } from "../utils/mergePagedRows";

export const ADDABLE_OFFICE_ASSET_STATUSES = "unassigned,awaiting_assignment";

export function useOfficeAssetOptions(isOpen: boolean, subsidiaryId?: string) {
  const [query, setQuery] = useState("");
  const [search] = useDebounce(query.trim(), 400);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<OfficeScopedEquipment[]>([]);

  useEffect(() => {
    setPage(1);
  }, [search, subsidiaryId]);

  const { data, isFetching } = useGetEquipmentsQuery(
    {
      companyId: subsidiaryId as string,
      params: {
        per_page: 15,
        search: search || undefined,
        status: ADDABLE_OFFICE_ASSET_STATUSES,
        page,
      },
    },
    { skip: !isOpen || !subsidiaryId },
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
        payload ? ((payload.data ?? []) as OfficeScopedEquipment[]) : undefined,
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
