import dayjs from "dayjs";
import type { RfqRecord } from "@/api/baseQueries/companiesApi/rfqsApi/types";
import { resolveRfqStatus } from "./rfqExpiration";
import type { CustomDeviceRequest, RequestStatus } from "./types";

const mapStatus = (status: string): RequestStatus => {
  if (status === "accepted") return "accepted";
  if (status === "confirmed") return "confirmed";
  if (status === "waiting_for_action") return "waiting_for_action";
  if (status === "rejected") return "rejected";
  if (status === "declined") return "rejected";
  if (status === "expired") return "expired";
  return "pending";
};

const toNumber = (value?: string | null): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeSpecification = (
  specification?: Record<string, string> | null,
) => {
  if (!specification) return undefined;

  const entries = Object.entries(specification).filter(
    ([key, value]) => key.trim() && String(value).trim(),
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

function responseAvailability(value: unknown) {
  return typeof value === "string" ? value.toLowerCase() : value;
}

export const formatRfqDescription = (description?: string | null) => {
  if (!description) return undefined;

  const formatted = description
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<\s*li\s*>/gi, "- ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return formatted || undefined;
};

export const mapRfqToCustomDeviceRequest = (
  rfq: RfqRecord,
  assetTypeNames = new Map<string, string>(),
): CustomDeviceRequest => {
  const responseDevices = rfq.response?.devices ?? [];

  return {
    rfqId: rfq.id,
    id: rfq.request_id || rfq.id,
    ...(rfq.catalog_order_request && {
      catalogOrderRequest: {
        id: rfq.catalog_order_request.id,
        catalogId: rfq.catalog_order_request.catalog_id,
        catalogName: rfq.catalog_order_request.catalog?.name,
      },
    }),
    country: rfq.country.name,
    countryId: rfq.country.id,
    countryCode: rfq.country.code,
    currency: rfq.currency,
    requestBudget: toNumber(rfq.total_request_budget) ?? 0,
    requiredBudget: toNumber(rfq.response?.total_quote),
    responseId: rfq.response?.id,
    status: resolveRfqStatus(
      mapStatus(rfq.status),
      rfq.response_expires_at,
      rfq.response_expired,
    ),
    createdAt: rfq.created_at
      ? dayjs(rfq.created_at).format("MMM DD, YYYY")
      : undefined,
    approvedAt: rfq.approved_at
      ? dayjs(rfq.approved_at).format("MMM DD, YYYY")
      : undefined,
    expiresAt: rfq.response_expires_at
      ? dayjs(rfq.response_expires_at).format("MMM DD, YYYY")
      : undefined,
    vendorNote: rfq.response?.note ?? undefined,
    devices: rfq.devices.map((device, index) => {
      // Match by position (index) instead of name — the vendor may respond with
      // a different device name when suggesting an alternative.
      const responseDevice = responseDevices[index];
      const quotePerUnit = toNumber(responseDevice?.quote_per_unit);
      const availability = responseAvailability(responseDevice?.availability);

      let vendorResponse;

      if (responseDevice) {
        const isAlternative = responseDevice.name !== device.name;

        if (availability === "unavailable" || availability === false) {
          vendorResponse = {
            type: "unavailable" as const,
            unavailableReason:
              formatRfqDescription(responseDevice.description) ??
              "This device is unavailable.",
          };
        } else if (isAlternative || availability === "alternative") {
          vendorResponse = {
            type: "alternative" as const,
            alternative: {
              name: responseDevice.name,
              price: quotePerUnit ?? 0,
              specs: responseDevice.description || undefined,
            },
          };
        } else if (availability === "quote" || availability === true) {
          vendorResponse = {
            type: "quoted" as const,
            quotedPrice: quotePerUnit,
          };
        }
      }

      return {
        responseDeviceId: responseDevice?.id,
        name: device.name,
        quantity: device.quantity,
        unitPrice: toNumber(device.budget_per_unit),
        assetType: device.asset_type,
        assetTypeName:
          assetTypeNames.get(device.asset_type) ?? device.asset_type,
        specification: normalizeSpecification(device.specification),
        description: formatRfqDescription(device.description),
        vendorResponse,
      };
    }),
  };
};
