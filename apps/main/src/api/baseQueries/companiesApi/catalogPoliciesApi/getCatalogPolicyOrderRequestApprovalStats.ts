import { companiesApi } from "..";

import type { CatalogOrderRequestApprovalStatsPayload } from "./types";

const getCatalogPolicyOrderRequestApprovalStats = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicyOrderRequestApprovalStats: build.query<
      ServerResponse<CatalogOrderRequestApprovalStatsPayload>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/catalog-policies/order-requests/approval-stats`,
      }),
      providesTags: [
        { type: "CatalogOrderRequests", id: "STATS" },
        "CatalogOrderRequests",
      ],
    }),
  }),
});

export const { useGetCatalogPolicyOrderRequestApprovalStatsQuery } =
  getCatalogPolicyOrderRequestApprovalStats;
