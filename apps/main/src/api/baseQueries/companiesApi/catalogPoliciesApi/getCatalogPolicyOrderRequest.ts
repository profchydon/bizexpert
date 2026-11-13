import { companiesApi } from "..";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

import type { CompanyOrderRequestArgs } from "./types";

const getCatalogPolicyOrderRequest = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicyOrderRequest: build.query<
      ServerResponse<CatalogOrderRequestApi>,
      CompanyOrderRequestArgs
    >({
      query: ({ companyId, orderRequestId }) => ({
        url: `/${companyId}/catalog-policies/order-requests/${orderRequestId}`,
      }),
      providesTags: (_result, _error, { orderRequestId }) => [
        { type: "CatalogOrderRequests", id: orderRequestId },
        { type: "CatalogOrderRequests", id: "ALL" },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const { useGetCatalogPolicyOrderRequestQuery } =
  getCatalogPolicyOrderRequest;
