"use client";

import { useEffect, useMemo, useState } from "react";
import { useTablePageQuery } from "@/hooks/useTablePageQuery";

import { useApproveCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/approveCatalogPolicyOrderRequest";
import { useConvertCatalogPolicyOrderRequestToRfqMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/convertCatalogPolicyOrderRequestToRfq";
import { useGetCatalogPolicyOrderRequestQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getCatalogPolicyOrderRequest";
import { useGetPendingCatalogPolicyOrderRequestsQuery } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/getPendingCatalogPolicyOrderRequests";
import { useRejectCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/rejectCatalogPolicyOrderRequest";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import { useAuthUserDetail } from "@/utils/useAuthUser";

import { useWorkspaceCompanyId } from "@/hooks/useWorkspaceCompanyId";
import {
  buildEmployeesMap,
  orderRequestListToRecords,
  orderRequestToRecord,
} from "./apiAdapters";
import { buildApproveOrderRequestArgs } from "./approvalApprovePayload";
import { approvalPageSize, orderRequestPageMeta } from "./pagination";
import { shouldCloseModalAfterApprovalAction } from "./approvalModalInteraction";
import type {
  ApprovalActionOptions,
  ApprovalRecord,
  ApprovalSort,
} from "./types";
import { useApprovalDetailEnrichment } from "./useApprovalDetailEnrichment";
import { useSwapApprovalItem } from "./useSwapApprovalItem";
import {
  convertToRfqPayload,
  filterApprovals,
  selectedApprovalRecord,
  sortApprovals,
} from "./utils";

export function useAwaitingApprovalsState() {
  const { getCompanyDetails } = useAuthUserDetail();
  const company = getCompanyDetails();
  const companyId = useWorkspaceCompanyId();
  const [search, setSearchValue] = useState("");
  const [sort, setSortValue] = useState<ApprovalSort>({
    column: "status",
    direction: "ascending",
  });
  const { page, setPage: setPageValue } = useTablePageQuery("awaiting_page");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const queryParams = useMemo(
    () => ({
      page,
      per_page: approvalPageSize,
      search: search.trim() || null,
    }),
    [page, search],
  );
  const pendingQuery = useGetPendingCatalogPolicyOrderRequestsQuery(
    {
      companyId: companyId!,
      params: queryParams,
    },
    { skip: !companyId },
  );
  const [approveRequest, approveState] =
    useApproveCatalogPolicyOrderRequestMutation();
  const [convertRequest, convertState] =
    useConvertCatalogPolicyOrderRequestToRfqMutation();
  const [rejectRequest, rejectState] =
    useRejectCatalogPolicyOrderRequestMutation();
  const records = useMemo(
    () => orderRequestListToRecords(pendingQuery.data?.data),
    [pendingQuery.data?.data],
  );
  const employees = useMemo(() => buildEmployeesMap(records), [records]);
  const filtered = useMemo(
    () => filterApprovals({ employees, records, search, tab: "awaiting" }),
    [employees, records, search],
  );
  const sorted = useMemo(
    () => sortApprovals(filtered, employees, sort),
    [employees, filtered, sort],
  );
  const selectedSummary =
    records.find((record) => record.id === selectedId) ?? null;
  const detailQuery = useGetCatalogPolicyOrderRequestQuery(
    {
      companyId: companyId!,
      orderRequestId: selectedId!,
    },
    { skip: !companyId || !selectedId },
  );
  const selectedDetail = useMemo(
    () =>
      selectedId && detailQuery.data?.data
        ? orderRequestToRecord(
            detailQuery.data.data,
            selectedSummary?.catalogId,
          )
        : null,
    [detailQuery.data?.data, selectedId, selectedSummary?.catalogId],
  );
  const selected = useApprovalDetailEnrichment({
    companyId: companyId,
    record:
      selectedApprovalRecord({ selectedDetail, selectedSummary }) ??
      selectedDetail,
  });
  const pageMeta = orderRequestPageMeta({
    fallbackPage: page,
    fallbackTotal: sorted.length,
    payload: pendingQuery.data?.data,
  });
  const swapState = useSwapApprovalItem({ companyId: companyId, records });

  useEffect(() => {
    if (page > pageMeta.totalPages) setPageValue(pageMeta.totalPages);
  }, [page, pageMeta.totalPages]);

  return {
    employees,
    isLoading: pendingQuery.isLoading,
    isSaving:
      approveState.isLoading ||
      convertState.isLoading ||
      rejectState.isLoading ||
      swapState.isSwapping,
    page: Math.min(pageMeta.page, pageMeta.totalPages),
    pageRecords: sorted,
    records: sorted,
    rejecting: records.find((record) => record.id === rejectingId) ?? null,
    search,
    selected,
    selectedLoading:
      Boolean(selectedId) && (detailQuery.isLoading || detailQuery.isFetching),
    selectedOrderRequest: detailQuery.data?.data ?? null,
    sort,
    total: pageMeta.total,
    totalPages: pageMeta.totalPages,
    async approve(
      id: string,
      detailRecord?: ApprovalRecord,
      options?: ApprovalActionOptions,
    ) {
      const record = detailRecord ?? records.find((item) => item.id === id);
      if (!companyId || !record?.catalogId) return;
      const convertPayload = convertToRfqPayload(record);
      if (convertPayload.devices.length) {
        const request = {
          catalogId: record.catalogId,
          companyId: companyId,
          orderRequestId: id,
          payload: convertPayload,
        };
        await convertRequest(request).unwrap();
        displaySuccessMessage(
          "Approval request converted to RFQ",
          record.kitName,
        );
        if (shouldCloseModalAfterApprovalAction("convert_to_rfq")) {
          setSelectedId(null);
        }
        return;
      }
      const request = buildApproveOrderRequestArgs({
        companyId: companyId,
        id,
        options,
        record,
      });
      if (!request) return;
      await approveRequest(request).unwrap();
      displaySuccessMessage("Approval request approved", record.kitName);
      if (shouldCloseModalAfterApprovalAction("approve")) {
        setSelectedId(null);
      }
    },
    async reject(id: string, reason: string) {
      const record = records.find((item) => item.id === id);
      if (!companyId || !record?.catalogId) return;
      await rejectRequest({
        catalogId: record.catalogId,
        companyId: companyId,
        orderRequestId: id,
        payload: { reason },
      }).unwrap();
      displaySuccessMessage("Approval request rejected", record.kitName);
      setRejectingId(null);
      setSelectedId(null);
    },
    swap: swapState.swap,
    setPage: setPageValue,
    setRejectingId,
    setSearch(value: string) {
      setSearchValue(value);
      setPageValue(1);
    },
    setSelectedId,
    setSort(sortValue: ApprovalSort) {
      setSortValue(sortValue);
      setPageValue(1);
    },
  };
}
