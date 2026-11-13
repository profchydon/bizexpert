import { companiesApi } from "..";
import type { RuleArgs } from "./types";

const deleteCatalogRule = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteCatalogRule: build.mutation<ServerResponse, RuleArgs>({
      query: ({ companyId, catalogId, ruleId }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules/${ruleId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "CatalogPolicies", id: "LIST" },
        "CatalogRules",
      ],
    }),
  }),
});

export const { useDeleteCatalogRuleMutation } = deleteCatalogRule;
