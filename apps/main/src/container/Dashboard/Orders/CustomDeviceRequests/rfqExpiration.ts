import dayjs, { type Dayjs } from "dayjs";
import type { CustomDeviceRequest, RequestStatus } from "./types";

export function isRfqQuotePastExpiry(
  expiresAt?: string | null,
  now: Dayjs = dayjs(),
) {
  if (!expiresAt) return false;

  const expiry = dayjs(expiresAt);
  return expiry.isValid() && !now.isBefore(expiry);
}

export function resolveRfqStatus(
  mappedStatus: RequestStatus,
  responseExpiresAt?: string | null,
  responseExpired = false,
  now: Dayjs = dayjs(),
): RequestStatus {
  if (
    mappedStatus === "waiting_for_action" &&
    (responseExpired || isRfqQuotePastExpiry(responseExpiresAt, now))
  ) {
    return "expired";
  }

  return mappedStatus;
}

export function canActOnRfqQuote(request: CustomDeviceRequest) {
  return request.status === "waiting_for_action";
}
