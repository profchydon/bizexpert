import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";

export const approvalPageSize = 20;

export function orderRequestPageMeta({
  fallbackPage,
  fallbackTotal,
  payload,
}: {
  fallbackPage: number;
  fallbackTotal: number;
  payload?: CatalogOrderRequestListPayload | CatalogOrderRequestApi[];
}) {
  if (!payload || Array.isArray(payload)) {
    return metaFromValues({
      page: fallbackPage,
      perPage: approvalPageSize,
      total: fallbackTotal,
      totalPages: Math.max(1, Math.ceil(fallbackTotal / approvalPageSize)),
    });
  }

  return metaFromValues({
    page: payload.current_page ?? fallbackPage,
    perPage: payload.per_page ?? approvalPageSize,
    total: payload.total ?? fallbackTotal,
    totalPages: payload.last_page,
  });
}

function metaFromValues({
  page,
  perPage,
  total,
  totalPages,
}: {
  page: number;
  perPage: number;
  total: number;
  totalPages?: number;
}) {
  return {
    page: Math.max(1, page),
    perPage,
    total,
    totalPages: Math.max(1, totalPages ?? Math.ceil(total / perPage)),
  };
}
