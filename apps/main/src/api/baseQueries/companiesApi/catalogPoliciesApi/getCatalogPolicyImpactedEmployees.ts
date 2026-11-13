import { companiesApi } from "..";
import type { CatalogPolicyImpactedEmployeeListPayload } from "@/types/catalogPolicy";
import type { CompanyCatalogArgs } from "./types";

const getCatalogPolicyImpactedEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicyImpactedEmployees: build.query<
      ServerResponse<CatalogPolicyImpactedEmployeeListPayload>,
      CompanyCatalogArgs & { params?: { page?: number; per_page?: number } }
    >({
      query: ({ companyId, catalogId, params }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/impacted-employees`,
        params,
      }),
    }),
  }),
});

export const { useGetCatalogPolicyImpactedEmployeesQuery } =
  getCatalogPolicyImpactedEmployees;
