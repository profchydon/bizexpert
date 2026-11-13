import { companiesApi } from "..";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

import type {
  OrderRequestArgs,
  RejectCatalogOrderRequestPayload,
} from "./types";

const rejectCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    rejectCatalogPolicyOrderRequest: build.mutation<
      ServerResponse<CatalogOrderRequestApi>,
      OrderRequestArgs & { payload: RejectCatalogOrderRequestPayload }
    >({
      query: ({ companyId, catalogId, orderRequestId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/order-requests/${orderRequestId}/reject`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { catalogId, orderRequestId }) => [
        { type: "CatalogOrderRequests", id: `${catalogId}:${orderRequestId}` },
        { type: "CatalogOrderRequests", id: orderRequestId },
        { type: "CatalogOrderRequests", id: catalogId },
        { type: "CatalogOrderRequests", id: "STATS" },
        { type: "CatalogOrderRequests", id: "ALL" },
        { type: "CatalogOrderRequests", id: "PENDING" },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const { useRejectCatalogPolicyOrderRequestMutation } =
  rejectCatalogPolicyOrderRequest;
