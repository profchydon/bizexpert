import type { CustomDeviceRequest } from "../types";
import routes from "@/routes";
import { canActOnRfqQuote } from "../rfqExpiration";

export function rfqDecisionStateKey(request: CustomDeviceRequest) {
  return request.rfqId || request.id || "";
}

export function shouldIgnoreQuoteSubmit(isSubmitting: boolean) {
  return isSubmitting;
}

export function selectedAvailableRfqDeviceIds(
  request: CustomDeviceRequest,
  selectedDevices: Set<number>,
) {
  return request.devices
    .filter((device, index) => {
      if (!selectedDevices.has(index)) return false;
      return device.vendorResponse?.type !== "unavailable";
    })
    .map((device) => device.responseDeviceId)
    .filter((deviceId): deviceId is string => Boolean(deviceId));
}

export function shouldRouteRfqDecisionToApproval(
  request: CustomDeviceRequest,
  allowApprovalRedirect = true,
) {
  return (
    allowApprovalRedirect &&
    canActOnRfqQuote(request) &&
    Boolean(request.catalogOrderRequest?.id) &&
    Boolean(request.catalogOrderRequest?.catalogId)
  );
}

export function approvalRequestHrefForRfq(
  request: CustomDeviceRequest,
  allowApprovalRedirect = true,
) {
  if (!shouldRouteRfqDecisionToApproval(request, allowApprovalRedirect)) {
    return null;
  }

  const { catalogId, id } = request.catalogOrderRequest!;
  const params = new URLSearchParams({ catalogId, requestId: id });
  return `${routes.APPROVALS}?${params.toString()}`;
}

export function rfqDetailsDrawerPaddingClass(
  request: CustomDeviceRequest,
  allowApprovalRedirect = true,
) {
  if (shouldRouteRfqDecisionToApproval(request, allowApprovalRedirect)) {
    return "pb-56";
  }

  if (request.status === "expired") {
    return "pb-56";
  }

  return "pb-24";
}
