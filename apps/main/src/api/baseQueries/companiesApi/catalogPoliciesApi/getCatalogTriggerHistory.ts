import { companiesApi } from "..";
import type {
  CatalogTriggerHistoryListParams,
  CatalogTriggerHistoryListPayload,
} from "@/types/catalogPolicyHistory";
import type { CompanyCatalogArgs } from "./types";

const getCatalogTriggerHistory = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogTriggerHistory: build.query<
      ServerResponse<CatalogTriggerHistoryListPayload>,
      CompanyCatalogArgs & { params?: CatalogTriggerHistoryListParams }
    >({
      query: ({ companyId, catalogId, params }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/trigger-history`,
        params,
      }),
      providesTags: ["CatalogTriggerHistory"],
    }),
  }),
});

export const { useGetCatalogTriggerHistoryQuery } = getCatalogTriggerHistory;
