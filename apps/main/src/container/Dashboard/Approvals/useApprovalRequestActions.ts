"use client";

import { Dispatch, SetStateAction } from "react";
import { useApproveCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/approveCatalogPolicyOrderRequest";
import { useConvertCatalogPolicyOrderRequestToRfqMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/convertCatalogPolicyOrderRequestToRfq";
import { useRejectCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/rejectCatalogPolicyOrderRequest";
import {
  computeTimeToDecisionSeconds,
  trackApprovalReviewed,
} from "@/lib/approvalAnalytics";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import type { ApprovalActionOptions, ApprovalRecord } from "./types";
import { buildApproveOrderRequestArgs } from "./approvalApprovePayload";
import { shouldCloseModalAfterApprovalAction } from "./approvalModalInteraction";
import { convertToRfqPayload } from "./utils";

interface UseApprovalRequestActionsArgs {
  companyId?: string;
  records: ApprovalRecord[];
  setRejectingId: Dispatch<SetStateAction<string | null>>;
  setSelectedId: (id: string | null) => void;
}

export function useApprovalRequestActions({
  companyId,
  records,
  setRejectingId,
  setSelectedId,
}: UseApprovalRequestActionsArgs) {
  const [approveRequest, approveState] =
    useApproveCatalogPolicyOrderRequestMutation();
  const [convertRequest, convertState] =
    useConvertCatalogPolicyOrderRequestToRfqMutation();
  const [rejectRequest, rejectState] =
    useRejectCatalogPolicyOrderRequestMutation();

  return {
    isSaving:
      approveState.isLoading || convertState.isLoading || rejectState.isLoading,
    async approve(
      id: string,
      detailRecord?: ApprovalRecord,
      options?: ApprovalActionOptions,
    ) {
      const record = detailRecord ?? records.find((item) => item.id === id);
      if (!companyId || !record?.catalogId) return;

      const convertPayload = convertToRfqPayload(record);
      if (convertPayload.devices.length) {
        await convertRequest({
          companyId,
          catalogId: record.catalogId,
          orderRequestId: id,
          payload: convertPayload,
        }).unwrap();
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
        companyId,
        id,
        options,
        record,
      });
      if (!request) return;
      await approveRequest(request).unwrap();
      trackApprovalReviewed({
        approval_id: id,
        decision: "approved",
        time_to_decision_s: computeTimeToDecisionSeconds(record.createdAt),
      });
      displaySuccessMessage("Approval request approved", record.kitName);
      if (shouldCloseModalAfterApprovalAction("approve")) {
        setSelectedId(null);
      }
    },
    async reject(
      id: string,
      reason: string,
      detailRecord?: ApprovalRecord | null,
    ) {
      const record = detailRecord ?? records.find((item) => item.id === id);
      if (!companyId || !record?.catalogId) return;

      await rejectRequest({
        companyId,
        catalogId: record.catalogId,
        orderRequestId: id,
        payload: { reason },
      }).unwrap();
      trackApprovalReviewed({
        approval_id: id,
        decision: "rejected",
        time_to_decision_s: computeTimeToDecisionSeconds(record.createdAt),
      });
      displaySuccessMessage("Approval request rejected", record.kitName);
      setRejectingId(null);
      setSelectedId(null);
    },
  };
}
