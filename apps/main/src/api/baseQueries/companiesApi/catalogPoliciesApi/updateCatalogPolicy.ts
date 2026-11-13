import { companiesApi } from "..";
import type {
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRequest,
} from "@/types/catalogPolicy";
import type { CompanyCatalogArgs } from "./types";

const updateCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateCatalogPolicy: build.mutation<
      ServerResponse<CatalogPolicyApiPolicy>,
      CompanyCatalogArgs & { payload: Partial<CatalogPolicyApiRequest> }
    >({
      query: ({ companyId, catalogId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { catalogId }) => [
        { type: "CatalogPolicies", id: catalogId },
        { type: "CatalogPolicies", id: "LIST" },
        "CatalogRules",
      ],
    }),
  }),
});

export const { useUpdateCatalogPolicyMutation } = updateCatalogPolicy;
