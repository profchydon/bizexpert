"use client";

import { useMemo } from "react";
import { useGetAssetTypesQuery } from "@/api/baseQueries/assetsApi/getAssetTypes";
import { useAcceptRfqQuoteMutation } from "@/api/baseQueries/companiesApi/rfqsApi/acceptRfqQuote";
import { useGetRfqQuery } from "@/api/baseQueries/companiesApi/rfqsApi/getRfq";
import { useRejectRfqQuoteMutation } from "@/api/baseQueries/companiesApi/rfqsApi/rejectRfqQuote";
import { mapRfqToCustomDeviceRequest } from "@/container/Dashboard/Orders/CustomDeviceRequests/apiMapper";
import RFQDetailsSidebar from "@/container/Dashboard/Orders/CustomDeviceRequests/components/RFQDetailsSidebar";
import type { CustomDeviceRequest } from "@/container/Dashboard/Orders/CustomDeviceRequests/types";
import useCart from "@/hooks/useCart";
import { trackRfqQuoteActioned } from "@/lib/approvalAnalytics";
import displayErrorMessage from "@/utils/displayErrorMessage";
import displaySuccessMessage from "@/utils/displaySuccessMessage";
import {
  canSubmitApprovalRfqQuote,
  clearCartAfterApprovalRfqAccept,
} from "../approvalRfqQuote";
import { canActOnRfqQuote } from "@/container/Dashboard/Orders/CustomDeviceRequests/rfqExpiration";

const placeholderRequest: CustomDeviceRequest = {
  rfqId: "",
  id: "",
  devices: [],
  requestBudget: 0,
  country: "",
  status: "pending",
};

export function ApprovalRfqDetailsDrawer({
  companyId,
  onAcceptSuccess,
  onClose,
  open,
  rfqId,
}: {
  companyId?: string;
  onAcceptSuccess?: () => void;
  onClose: () => void;
  open: boolean;
  rfqId: string | null;
}) {
  const [acceptRfqQuote] = useAcceptRfqQuoteMutation();
  const [rejectRfqQuote] = useRejectRfqQuoteMutation();
  const { removeAllItemsFromCart } = useCart();
  const { data: assetTypesResponse } = useGetAssetTypesQuery(undefined, {
    skip: !open,
  });
  const assetTypeNames = useMemo(
    () =>
      new Map(
        (assetTypesResponse?.data ?? []).map((assetType) => [
          assetType.id,
          assetType.name,
        ]),
      ),
    [assetTypesResponse?.data],
  );
  const rfqQuery = useGetRfqQuery(
    { companyId, rfqId: rfqId ?? undefined },
    { skip: !open || !companyId || !rfqId },
  );
  const request = rfqQuery.data?.data
    ? {
        ...mapRfqToCustomDeviceRequest(rfqQuery.data.data, assetTypeNames),
        hideDeviceSelection: true,
      }
    : placeholderRequest;

  return (
    <RFQDetailsSidebar
      isOpen={open && Boolean(rfqId)}
      isLoadingDetails={rfqQuery.isLoading || rfqQuery.isFetching}
      request={request}
      showApprovalRequestRedirect={false}
      onClose={onClose}
      onAccept={async (currentRequest, selectedDeviceIds) => {
        if (!canActOnRfqQuote(currentRequest)) {
          displayErrorMessage(
            "This quote has expired. Please submit a new request.",
          );
          return false;
        }

        if (
          !canSubmitApprovalRfqQuote({
            companyId,
            responseId: currentRequest.responseId,
            selectedDeviceIds,
          })
        ) {
          displayErrorMessage("Unable to accept quote. Please try again.");
          return false;
        }

        try {
          await acceptRfqQuote({
            companyId,
            rfqId: currentRequest.rfqId,
            rfqResponseId: currentRequest.responseId,
            deviceIds: selectedDeviceIds,
          }).unwrap();

          await clearCartAfterApprovalRfqAccept({
            clearCart: removeAllItemsFromCart,
            wasAccepted: true,
          });
          if (currentRequest.catalogOrderRequest?.id) {
            trackRfqQuoteActioned({
              approval_id: currentRequest.catalogOrderRequest.id,
              decision: "accepted",
            });
          }
          onAcceptSuccess?.();
          return true;
        } catch {
          displayErrorMessage("Unable to accept quote. Please try again.");
          return false;
        }
      }}
      onDecline={async (currentRequest, rejectionReason) => {
        if (!companyId || !currentRequest.responseId) {
          displayErrorMessage("Unable to reject quote. Please try again.");
          return false;
        }

        try {
          await rejectRfqQuote({
            companyId,
            rfqId: currentRequest.rfqId,
            rfqResponseId: currentRequest.responseId,
            clientRejectionReason: rejectionReason,
          }).unwrap();
          if (currentRequest.catalogOrderRequest?.id) {
            trackRfqQuoteActioned({
              approval_id: currentRequest.catalogOrderRequest.id,
              decision: "declined",
            });
          }
          displaySuccessMessage(
            "RFQ quote rejected",
            "The quote has been rejected.",
          );
          return true;
        } catch {
          displayErrorMessage("Unable to reject quote. Please try again.");
          return false;
        }
      }}
    />
  );
}
