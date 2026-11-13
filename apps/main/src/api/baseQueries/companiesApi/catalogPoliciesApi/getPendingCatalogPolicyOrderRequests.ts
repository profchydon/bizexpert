import { companiesApi } from "..";
import type {
  CatalogOrderRequestApi,
  CatalogOrderRequestListPayload,
} from "@/types/catalogPolicyOrderRequest";

import type { CatalogOrderRequestsParams } from "./types";

const getPendingCatalogPolicyOrderRequests = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getPendingCatalogPolicyOrderRequests: build.query<
      ServerResponse<CatalogOrderRequestListPayload | CatalogOrderRequestApi[]>,
      { companyId: string; params?: CatalogOrderRequestsParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/catalog-policies/order-requests/pending-approvals`,
        params,
      }),
      providesTags: [
        { type: "CatalogOrderRequests", id: "PENDING" },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const {
  useGetPendingCatalogPolicyOrderRequestsQuery,
  useLazyGetPendingCatalogPolicyOrderRequestsQuery,
} = getPendingCatalogPolicyOrderRequests;
