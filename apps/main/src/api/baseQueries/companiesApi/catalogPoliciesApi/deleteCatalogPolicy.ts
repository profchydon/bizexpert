import { companiesApi } from "..";
import type { CompanyCatalogArgs } from "./types";

const deleteCatalogPolicy = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteCatalogPolicy: build.mutation<ServerResponse, CompanyCatalogArgs>({
      query: ({ companyId, catalogId }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CatalogPolicies", id: "LIST" }],
    }),
  }),
});

export const { useDeleteCatalogPolicyMutation } = deleteCatalogPolicy;
