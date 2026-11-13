"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";
import { useDebounce } from "use-debounce";

import { useGetCatalogPolicyOrderRequestQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequest";
import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  approvalRequestIdFromUrl,
  clearApprovalRequestUrl,
} from "./approvalUrl";
import { getPendingApprovalRfqs } from "./approvalRfqs";
import { buildEmployeesMap, orderRequestToRecord } from "./apiAdapters";
import type { ApprovalFilterTab, ApprovalSort } from "./types";
import { useApprovalRecords } from "./useApprovalRecords";
import { useApprovalListRefresh } from "./useApprovalListRefresh";
import { useApprovalRequestActions } from "./useApprovalRequestActions";
import { useApprovalDetailEnrichment } from "./useApprovalDetailEnrichment";
import { useSwapApprovalItem } from "./useSwapApprovalItem";
import { approvalPageSize, orderRequestPageMeta } from "./pagination";
import {
  defaultApprovalTab,
  filterApprovals,
  selectedApprovalRecord,
  sortApprovals,
} from "./utils";

export function useApprovalsState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const companyId = useWorkspaceCompanyId();
  const urlRequestId = approvalRequestIdFromUrl(searchParams.get("requestId"));
  const urlCatalogId = searchParams.get("catalogId") ?? undefined;
  const hasPaymentResultParams =
    searchParams.has("success_instance") ||
    searchParams.has("error_instance") ||
    searchParams.has("tx_ref") ||
    searchParams.has("status");
  const [search, setSearchValue] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [activeTab, setActiveTabValue] =
    useState<ApprovalFilterTab>(defaultApprovalTab);
  const [sort, setSortValue] = useState<ApprovalSort>({
    column: "status",
    direction: "ascending",
  });
  const { page, setPage: setPageValue } = useTablePageQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const dismissedUrlRequestIdRef = useRef<string | null>(null);
  const selectApproval = (id: string | null) => {
    setSelectedId(id);

    if (id === null && (urlRequestId || hasPaymentResultParams)) {
      dismissedUrlRequestIdRef.current = urlRequestId;
      router.replace(
        clearApprovalRequestUrl(pathname, searchParams.toString()),
        { scroll: false },
      );
    }
  };
  const queryParams = useMemo(
    () => ({
      page,
      per_page: approvalPageSize,
      search: debouncedSearch.trim() || null,
    }),
    [debouncedSearch, page],
  );
  const approvalRecords = useApprovalRecords({
    activeTab,
    companyId: companyId,
    queryParams,
  });
  const refreshApprovalLists = useApprovalListRefresh(companyId);
  const apiRecords = approvalRecords.records;
  const selectedSummary =
    apiRecords.find((record) => record.id === selectedId) ?? null;
  const selectedDetailQuery = useGetCatalogPolicyOrderRequestQuery(
    {
      companyId: companyId!,
      orderRequestId: selectedId!,
    },
    { skip: !companyId || !selectedId },
  );
  const selectedDetail = useMemo(
    () =>
      selectedId && selectedDetailQuery.data?.data
        ? orderRequestToRecord(
            selectedDetailQuery.data.data,
            selectedSummary?.catalogId ?? urlCatalogId,
          )
        : null,
    [selectedDetailQuery.data?.data, selectedId, selectedSummary, urlCatalogId],
  );
  const records = apiRecords;
  const employees = useMemo(() => buildEmployeesMap(records), [records]);
  const filtered = useMemo(
    () => filterApprovals({ employees, records, search, tab: activeTab }),
    [activeTab, employees, records, search],
  );
  const sorted = useMemo(
    () => sortApprovals(filtered, employees, sort),
    [employees, filtered, sort],
  );
  const pageMeta = orderRequestPageMeta({
    fallbackPage: page,
    fallbackTotal: sorted.length,
    payload: approvalRecords.activePayload,
  });
  useEffect(() => {
    if (page > pageMeta.totalPages) setPageValue(pageMeta.totalPages);
  }, [page, pageMeta.totalPages]);
  useEffect(() => {
    if (!urlRequestId) {
      dismissedUrlRequestIdRef.current = null;
      return;
    }

    if (dismissedUrlRequestIdRef.current === urlRequestId) return;

    setSelectedId((current) =>
      current === urlRequestId ? current : urlRequestId,
    );
  }, [urlRequestId]);
  const selectedRecordBase = selectedId
    ? (selectedApprovalRecord({ selectedDetail, selectedSummary }) ??
      selectedDetail)
    : null;
  const pendingRfqs = getPendingApprovalRfqs(selectedDetailQuery.data?.data);
  const selectedRecord =
    selectedRecordBase && pendingRfqs.length
      ? { ...selectedRecordBase, pendingRfqs }
      : selectedRecordBase;
  const selected = useApprovalDetailEnrichment({
    companyId: companyId,
    record: selectedRecord,
  });
  const rejecting =
    records.find((record) => record.id === rejectingId) ??
    (selected?.id === rejectingId ? selected : null);
  const swapState = useSwapApprovalItem({ companyId: companyId, records });
  const requestActions = useApprovalRequestActions({
    companyId: companyId,
    records,
    setRejectingId,
    setSelectedId: selectApproval,
  });
  return {
    activeTab,
    companyId: companyId,
    counts: approvalRecords.counts,
    employees,
    page: Math.min(pageMeta.page, pageMeta.totalPages),
    pageRecords: sorted,
    pageSize: pageMeta.perPage,
    records: sorted,
    rejecting,
    search,
    selected,
    selectedLoading:
      Boolean(selectedId) &&
      (selectedDetailQuery.isLoading || selectedDetailQuery.isFetching),
    selectedOrderRequest: selectedDetailQuery.data?.data ?? null,
    sort,
    total: pageMeta.total,
    totalPages: pageMeta.totalPages,
    isLoading: approvalRecords.isLoading,
    isSaving: requestActions.isSaving || swapState.isSwapping,
    approve: requestActions.approve,
    async refetchSelectedOrderRequest() {
      if (!selectedId || !companyId) return;
      await Promise.all([
        selectedDetailQuery.refetch(),
        refreshApprovalLists(),
      ]);
    },
    reject: requestActions.reject,
    swap: swapState.swap,
    setActiveTab(tab: ApprovalFilterTab) {
      setActiveTabValue(tab);
      setPageValue(1);
    },
    setPage: setPageValue,
    setRejectingId,
    setSearch(value: string) {
      setSearchValue(value);
      setPageValue(1);
    },
    setSelectedId: selectApproval,
    setSort(sort: ApprovalSort) {
      setSortValue(sort);
      setPageValue(1);
    },
  };
}
