import { companiesApi } from "..";
import type { CatalogPolicyApiPolicy } from "@/types/catalogPolicy";
import type { CompanyCatalogArgs } from "./types";

const deactivateCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deactivateCatalogPolicy: build.mutation<
      ServerResponse<CatalogPolicyApiPolicy>,
      CompanyCatalogArgs
    >({
      query: ({ companyId, catalogId }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, { catalogId }) => [
        { type: "CatalogPolicies", id: catalogId },
        { type: "CatalogPolicies", id: "LIST" },
        "CatalogRules",
      ],
    }),
  }),
});

export const { useDeactivateCatalogPolicyMutation } = deactivateCatalogPolicy;
