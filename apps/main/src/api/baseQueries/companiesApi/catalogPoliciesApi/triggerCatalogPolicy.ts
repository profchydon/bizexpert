import { companiesApi } from "..";
import type {
  CatalogTriggerHistory,
  TriggerCatalogRuleRequest,
} from "@/types/catalogPolicyHistory";
import type { CompanyCatalogArgs } from "./types";

const triggerCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    triggerCatalogPolicy: build.mutation<
      ServerResponse<CatalogTriggerHistory>,
      CompanyCatalogArgs & { payload: TriggerCatalogRuleRequest }
    >({
      query: ({ companyId, catalogId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/trigger-history/trigger`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["CatalogTriggerHistory"],
    }),
  }),
});

export const { useTriggerCatalogPolicyMutation } = triggerCatalogPolicy;
