import { companiesApi } from "..";
import type { CatalogPolicyApiRule } from "@/types/catalogPolicy";
import type { RuleArgs } from "./types";

const getCatalogRule = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogRule: build.query<ServerResponse<CatalogPolicyApiRule>, RuleArgs>(
      {
        query: ({ companyId, catalogId, ruleId }) => ({
          url: `/${companyId}/catalog-policies/${catalogId}/rules/${ruleId}`,
        }),
        providesTags: (_result, _error, { ruleId }) => [
          { type: "CatalogRules", id: ruleId },
          "CatalogRules",
        ],
      },
    ),
  }),
});

export const { useGetCatalogRuleQuery } = getCatalogRule;
