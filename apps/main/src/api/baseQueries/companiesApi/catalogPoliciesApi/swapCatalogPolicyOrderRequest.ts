import { companiesApi } from "..";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

import type { SwapOrderRequestArgs } from "./types";

const swapCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    swapCatalogPolicyOrderRequest: build.mutation<
      ServerResponse<CatalogOrderRequestApi>,
      SwapOrderRequestArgs
    >({
      query: ({
        catalogId,
        companyId,
        orderRequestId,
        originalKitItemId,
        payload,
      }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/order-requests/${orderRequestId}/swaps/${originalKitItemId}`,
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

export const { useSwapCatalogPolicyOrderRequestMutation } =
  swapCatalogPolicyOrderRequest;
