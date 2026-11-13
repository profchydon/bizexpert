import { companiesApi } from "..";
import type { CatalogPolicyApiPolicy } from "@/types/catalogPolicy";
import type { CompanyCatalogArgs } from "./types";

const getCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicy: build.query<
      ServerResponse<CatalogPolicyApiPolicy>,
      CompanyCatalogArgs
    >({
      query: ({ companyId, catalogId }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}`,
      }),
      providesTags: (_result, _error, { catalogId }) => [
        { type: "CatalogPolicies", id: catalogId },
      ],
    }),
  }),
});

export const { useGetCatalogPolicyQuery } = getCatalogPolicy;
