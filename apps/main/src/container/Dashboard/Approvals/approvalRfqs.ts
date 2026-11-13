import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";
import type { ApprovalRfqSummary } from "./types";

export function getPendingApprovalRfqs(
  request?: CatalogOrderRequestApi,
): ApprovalRfqSummary[] {
  return (request?.rfqs ?? [])
    .filter((rfq) => {
      const status = rfq.status?.toLowerCase();
      return (
        rfq.id &&
        (status === "pending" ||
          status === "approved" ||
          status === "accepted" ||
          status === "declined" ||
          status === "rejected")
      );
    })
    .map((rfq) => ({
      id: rfq.id!,
      requestId: rfq.request_id ?? undefined,
      status: rfq.status ?? undefined,
    }));
}
