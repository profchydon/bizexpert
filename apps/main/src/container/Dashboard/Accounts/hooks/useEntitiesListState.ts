"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import type { SubsidiaryStatus } from "../types";

export const ENTITIES_SEARCH_DEBOUNCE_MS = 400;

export function useEntitiesListState() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, ENTITIES_SEARCH_DEBOUNCE_MS);
  const [statuses, setStatuses] = useState<SubsidiaryStatus[]>([]);
  const { page, setPage } = useTablePageQuery();
  useResetTablePage(setPage, debouncedSearch, statuses);

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 || statuses.length > 0;

  return {
    search,
    setSearch,
    debouncedSearch,
    statuses,
    setStatuses,
    page,
    setPage,
    hasActiveFilters,
  };
}
