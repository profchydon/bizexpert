import { companiesApi } from "..";
import type {
  CatalogPolicyListParams,
  CatalogPolicyListPayload,
} from "@/types/catalogPolicy";

const getCatalogPolicies = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicies: build.query<
      ServerResponse<CatalogPolicyListPayload>,
      { companyId: string; params?: CatalogPolicyListParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/catalog-policies`,
        params,
      }),
      providesTags: [{ type: "CatalogPolicies", id: "LIST" }],
    }),
  }),
});

export const { useGetCatalogPoliciesQuery } = getCatalogPolicies;
