"use client";

import { useMemo } from "react";
import type { SortDescriptor } from "react-aria-components";
import { useDebounce } from "use-debounce";
import { STORAGE_SEARCH_DEBOUNCE_MS } from "../constants/storageSearch";
import { useGetInStorageInventoryQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageInventory";
import { useGetInStorageInventorySummaryQuery } from "@/api/baseQueries/companiesApi/equipmentsApi/getInStorageInventorySummary";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import { useWorkspaceEquipmentDefaults } from "@/hooks/useWorkspaceEquipmentDefaults";
import { currentQueryList } from "@/utils/currentQueryList";
import { isQueryResultPending } from "@/utils/isQueryResultPending";
import type { InventoryFilters } from "../types/storage";
import { buildInStorageInventoryParams } from "../utils/buildInStorageInventoryParams";
import { mapInStorageInventoryItem } from "../utils/mapInStorageInventoryItem";
import { mapInStorageInventorySummary } from "../utils/mapInStorageInventorySummary";

interface UseStorageInventoryApiInput {
  filters: InventoryFilters;
  sort: SortDescriptor;
  page: number;
  pageSize: number;
}

export function useStorageInventoryApi({
  filters,
  sort,
  page,
  pageSize,
}: UseStorageInventoryApiInput) {
  const companyId = useWorkspaceCompanyId() ?? "";
  const { currencyCode } = useWorkspaceEquipmentDefaults();
  const [debouncedSearch] = useDebounce(
    filters.search,
    STORAGE_SEARCH_DEBOUNCE_MS,
  );

  const listParams = useMemo(
    () =>
      buildInStorageInventoryParams({
        filters: { ...filters, search: debouncedSearch },
        sort,
        page,
        pageSize,
        grouped: filters.grouped,
      }),
    [debouncedSearch, filters, page, pageSize, sort],
  );

  const listQuery = useGetInStorageInventoryQuery(
    { companyId, params: listParams },
    { skip: !companyId },
  );

  const summaryQuery = useGetInStorageInventorySummaryQuery(
    { companyId },
    { skip: !companyId },
  );

  const inventoryRows = currentQueryList(listQuery.currentData);
  const devices = useMemo(
    () =>
      inventoryRows.map((item) =>
        mapInStorageInventoryItem(item, currencyCode),
      ),
    [currencyCode, inventoryRows],
  );

  const overview = useMemo(
    () => mapInStorageInventorySummary(summaryQuery.data?.data),
    [summaryQuery.data],
  );

  const inventoryPage = listQuery.currentData?.data;
  const pagination = {
    total: inventoryPage?.total ?? 0,
    currentPage: inventoryPage?.current_page ?? page,
    lastPage: inventoryPage?.last_page ?? 1,
    perPage: inventoryPage?.per_page ?? pageSize,
  };

  const refetch = () => {
    void listQuery.refetch();
    void summaryQuery.refetch();
  };

  return {
    devices,
    overview,
    countryOptions: overview.countryOptions,
    deviceTypes: overview.deviceTypes,
    pagination,
    isLoading: isQueryResultPending({
      ...listQuery,
      hasRows: devices.length > 0,
    }),
    isOverviewLoading: isQueryResultPending({
      ...summaryQuery,
      hasRows: overview.totalCount > 0,
    }),
    isError: listQuery.isError || summaryQuery.isError,
    refetch,
  };
}

export type { StorageCountryOption } from "../types/inventoryApi";
