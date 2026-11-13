import { companiesApi } from "..";
import type {
  CatalogPolicyApiRule,
  CatalogPolicyApiRulePayload,
} from "@/types/catalogPolicy";
import type { RuleArgs } from "./types";

const updateCatalogRule = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateCatalogRule: build.mutation<
      ServerResponse<CatalogPolicyApiRule>,
      RuleArgs & { payload: Partial<CatalogPolicyApiRulePayload> }
    >({
      query: ({ companyId, catalogId, ruleId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules/${ruleId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: [
        { type: "CatalogPolicies", id: "LIST" },
        "CatalogRules",
      ],
    }),
  }),
});

export const { useUpdateCatalogRuleMutation } = updateCatalogRule;
