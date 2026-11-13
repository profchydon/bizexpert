"use client";

import { useState } from "react";
import { useResetTablePage } from "@/hooks/useResetTablePage";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useDebounce } from "use-debounce";
import { ORDERS_DEFAULT_PAGE_SIZE } from "../constants/ordersTabConstants";
import {
  STORAGE_SEARCH_DEBOUNCE_MS,
  normalizeStorageSearchQuery,
} from "../constants/storageSearch";
import { ORDER_DIRECTION_LABEL } from "../data/storageMeta";
import type { OrderDirection, StorageOrder } from "../types/storage";
import type { OrdersStatusTab } from "../utils/buildInStorageOrdersParams";
import { useStorageOrdersApi } from "./useStorageOrdersApi";

const STATUS_TABS: { id: OrdersStatusTab; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "completed", label: "Completed" },
];

export const MOVEMENT_ITEMS: { id: OrderDirection | "all"; label: string }[] = [
  { id: "all", label: "All movements" },
  { id: "inbound", label: ORDER_DIRECTION_LABEL.inbound },
  { id: "outbound", label: ORDER_DIRECTION_LABEL.outbound },
  { id: "service", label: ORDER_DIRECTION_LABEL.service },
];

export function useOrdersTabController(onOpen: (order: StorageOrder) => void) {
  const [statusTab, setStatusTab] = useState<OrdersStatusTab>("active");
  const [movement, setMovement] = useState<OrderDirection | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, STORAGE_SEARCH_DEBOUNCE_MS);
  const { page, setPage } = useTablePageQuery("orders_page");
  const [pageSize, setPageSize] = useState(ORDERS_DEFAULT_PAGE_SIZE);

  useResetTablePage(setPage, debouncedSearch, movement, statusTab);

  const api = useStorageOrdersApi({
    debouncedSearch,
    statusTab,
    movement,
    page,
    pageSize,
  });

  const resetPage = () => setPage(1);

  const statusTabs = STATUS_TABS.map((tab) => ({
    ...tab,
    count: api.tabCounts[tab.id],
  }));

  const showPagination = api.pagination.total > ORDERS_DEFAULT_PAGE_SIZE;
  const hasActiveSearch =
    normalizeStorageSearchQuery(debouncedSearch).length > 0;

  return {
    api,
    statusTab,
    setStatusTab,
    movement,
    setMovement,
    search,
    setSearch,
    debouncedSearch,
    hasActiveSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    resetPage,
    clearSearch: () => setSearch(""),
    statusTabs,
    showPagination,
    onOpen,
  };
}
