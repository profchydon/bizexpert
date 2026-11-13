"use client";

import { useSwapCatalogPolicyOrderRequestMutation } from "@/api/baseQueries/companiesApi/catalogPoliciesApi/swapCatalogPolicyOrderRequest";
import displaySuccessMessage from "@/utils/displaySuccessMessage";

import { type ApprovalSwapDraft, swapDraftToPayload } from "./swapUtils";
import type { ApprovalRecord } from "./types";

export function useSwapApprovalItem({
  companyId,
  records,
}: {
  companyId?: string;
  records: ApprovalRecord[];
}) {
  const [swapRequest, swapState] = useSwapCatalogPolicyOrderRequestMutation();

  return {
    isSwapping: swapState.isLoading,
    async swap(id: string, draft: ApprovalSwapDraft) {
      const record = records.find((item) => item.id === id);
      if (!companyId || !record?.catalogId) return;
      const request = {
        catalogId: record.catalogId,
        companyId,
        orderRequestId: id,
        originalKitItemId: draft.originalKitItemId,
        payload: swapDraftToPayload(draft),
      };
      await swapRequest(request).unwrap();
      displaySuccessMessage("Approval item swapped", record.kitName);
    },
  };
}
