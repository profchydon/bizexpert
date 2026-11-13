import { companiesApi } from "..";
import type {
  CatalogPolicyApiPolicy,
  CatalogPolicyApiRequest,
} from "@/types/catalogPolicy";

const createCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createCatalogPolicy: build.mutation<
      ServerResponse<CatalogPolicyApiPolicy>,
      { companyId: string; payload: CatalogPolicyApiRequest }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/catalog-policies`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "CatalogPolicies", id: "LIST" }],
    }),
  }),
});

export const { useCreateCatalogPolicyMutation } = createCatalogPolicy;
