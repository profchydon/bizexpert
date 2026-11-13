import { companiesApi } from "..";
import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";

import type { CatalogOrderRequestsParams } from "./types";

const getCatalogPolicyOrderRequests = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicyOrderRequests: build.query<
      ServerResponse<CatalogOrderRequestListPayload | CatalogOrderRequestApi[]>,
      { companyId: string; params?: CatalogOrderRequestsParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/catalog-policies/order-requests`,
        params,
      }),
      providesTags: [
        { type: "CatalogOrderRequests", id: "ALL" },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const {
  useGetCatalogPolicyOrderRequestsQuery,
  useLazyGetCatalogPolicyOrderRequestsQuery,
} = getCatalogPolicyOrderRequests;
