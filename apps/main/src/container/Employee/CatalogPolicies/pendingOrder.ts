import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";

export const pendingCatalogPolicyOrderMessage =
  "You have a pending order yet to be reviewed.";
export const approvedCatalogPolicyOrderMessage =
  "You can only place a request once for this catalog policy.";

export function isPendingCatalogPolicyOrder(
  request?: Pick<CatalogOrderRequestApi, "status"> | null,
) {
  const status = (request?.status ?? "").toLowerCase();
  return [
    "pending",
    "pending_approval",
    "awaiting_approval",
    "awaiting_rfq",
    "pending_rfq",
    "rfq",
  ].includes(status);
}

export function isApprovedCatalogPolicyOrder(
  request?: Pick<CatalogOrderRequestApi, "status"> | null,
) {
  const status = (request?.status ?? "").toLowerCase();
  return ["approved", "placed", "completed"].includes(status);
}

export function hasPendingCatalogPolicyOrder(
  payload?: CatalogOrderRequestApi[] | CatalogOrderRequestListPayload,
) {
  return extractCatalogPolicyOrderRequests(payload).some(
    isPendingCatalogPolicyOrder,
  );
}

export function hasApprovedCatalogPolicyOrder(
  payload?: CatalogOrderRequestApi[] | CatalogOrderRequestListPayload,
) {
  return extractCatalogPolicyOrderRequests(payload).some(
    isApprovedCatalogPolicyOrder,
  );
}

function extractCatalogPolicyOrderRequests(
  payload?: CatalogOrderRequestApi[] | CatalogOrderRequestListPayload,
) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.requests)) return payload.requests;
  if (Array.isArray(payload.order_requests)) return payload.order_requests;
  return payload.pending_approvals ?? [];
}
