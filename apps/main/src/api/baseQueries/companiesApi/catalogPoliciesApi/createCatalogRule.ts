import { companiesApi } from "..";
import type { CatalogPolicyApiRule } from "@/types/catalogPolicy";
import type { CompanyCatalogArgs, CreateCatalogRulePayload } from "./types";

const createCatalogRule = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createCatalogRule: build.mutation<
      ServerResponse<CatalogPolicyApiRule>,
      CompanyCatalogArgs & { payload: CreateCatalogRulePayload }
    >({
      query: ({ companyId, catalogId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [
        { type: "CatalogPolicies", id: "LIST" },
        "CatalogRules",
      ],
    }),
  }),
});

export const { useCreateCatalogRuleMutation } = createCatalogRule;
