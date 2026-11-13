"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetEntitiesQuery } from "@/api/baseQueries/companiesApi/entitiesApi/getEntities";
import { mapEntityCountryLabel } from "@/api/baseQueries/companiesApi/entitiesApi/mapEntityCountryLabel";
import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { useEntitiesListCompanyId } from "@/hooks/useEntitiesListCompanyId";
import type { OfficeParent } from "../../types";
import { ENTITIES_PAGE_SIZE } from "../../constants/entitiesPagination";
import { mergeEntityPages } from "../../utils/mergeEntityPages";

export function useOfficeParents(search = "") {
  const companyId = useEntitiesListCompanyId();
  const [page, setPage] = useState(1);
  const [entities, setEntities] = useState<EntityApiRecord[]>([]);
  const [debouncedSearch] = useDebounce(search.trim(), 400);

  useEffect(() => {
    setPage(1);
    setEntities([]);
  }, [companyId, debouncedSearch]);

  const query = useGetEntitiesQuery(
    {
      companyId: companyId as string,
      params: {
        page,
        per_page: ENTITIES_PAGE_SIZE,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      },
    },
    { skip: !companyId },
  );

  const payload = query.currentData?.data;
  const lastPage = payload?.last_page ?? 1;
  const hasMore = page < lastPage;

  useEffect(() => {
    if (!payload?.data) return;
    setEntities((current) => mergeEntityPages(current, payload.data, page));
  }, [page, payload?.data]);

  const parents: OfficeParent[] = useMemo(
    () =>
      entities
        .filter((entity) => entity.lifecycle_status !== "closed")
        .map((entity) => ({
          id: entity.id,
          name: entity.name,
          region: mapEntityCountryLabel(entity.country),
          currency: entity.billing_currency ?? "",
          officesCount: entity.offices_count ?? 0,
        })),
    [entities],
  );

  const loadMore = useCallback(() => {
    if (!hasMore || query.isFetching) return;
    setPage((current) => current + 1);
  }, [hasMore, query.isFetching]);

  return {
    parents,
    isLoading: query.isFetching && entities.length === 0,
    isError: query.isError,
    hasMore,
    isLoadingMore: query.isFetching && entities.length > 0,
    isSearching: query.isFetching && Boolean(debouncedSearch),
    loadMore,
  };
}
