import { companiesApi } from "..";
import type { CatalogOrderRequestApi } from "@/types/catalogPolicyOrderRequest";

import type { ConvertOrderRequestToRfqArgs } from "./types";

const convertCatalogPolicyOrderRequestToRfq = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    convertCatalogPolicyOrderRequestToRfq: build.mutation<
      ServerResponse<CatalogOrderRequestApi>,
      ConvertOrderRequestToRfqArgs
    >({
      query: ({ catalogId, companyId, orderRequestId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/order-requests/${orderRequestId}/convert-to-rfq`,
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

export const { useConvertCatalogPolicyOrderRequestToRfqMutation } =
  convertCatalogPolicyOrderRequestToRfq;
