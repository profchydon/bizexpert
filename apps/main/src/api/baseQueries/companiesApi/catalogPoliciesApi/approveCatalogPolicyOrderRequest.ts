import { companiesApi } from "..";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

import type { ApproveOrderRequestArgs } from "./types";

const approveCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    approveCatalogPolicyOrderRequest: build.mutation<
      ServerResponse<CatalogOrderRequestApi>,
      ApproveOrderRequestArgs
    >({
      query: ({ companyId, catalogId, orderRequestId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/order-requests/${orderRequestId}/approve`,
        method: "POST",
        data: payload ?? {},
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

export const { useApproveCatalogPolicyOrderRequestMutation } =
  approveCatalogPolicyOrderRequest;
