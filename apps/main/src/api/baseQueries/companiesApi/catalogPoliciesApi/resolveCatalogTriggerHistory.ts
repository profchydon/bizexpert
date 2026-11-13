import { companiesApi } from "..";
import type {
  CatalogTriggerHistory,
  ResolveTriggerHistoryRequest,
} from "@/types/catalogPolicyHistory";
import type { CompanyCatalogArgs } from "./types";

const resolveCatalogTriggerHistory = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    resolveCatalogTriggerHistory: build.mutation<
      ServerResponse<CatalogTriggerHistory>,
      CompanyCatalogArgs & {
        historyId: string;
        payload: ResolveTriggerHistoryRequest;
      }
    >({
      query: ({ companyId, catalogId, historyId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/trigger-history/${historyId}/resolve`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["CatalogTriggerHistory"],
    }),
  }),
});

export const { useResolveCatalogTriggerHistoryMutation } =
  resolveCatalogTriggerHistory;
