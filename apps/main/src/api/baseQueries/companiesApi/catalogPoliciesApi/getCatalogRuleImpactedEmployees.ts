import { companiesApi } from "..";
import type { CatalogPolicyImpactedEmployeeListPayload } from "@/types/catalogPolicy";
import type { RuleArgs } from "./types";

const getCatalogRuleImpactedEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogRuleImpactedEmployees: build.query<
      ServerResponse<CatalogPolicyImpactedEmployeeListPayload>,
      RuleArgs & { params?: { page?: number; per_page?: number } }
    >({
      query: ({ companyId, catalogId, ruleId, params }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules/${ruleId}/impacted-employees`,
        params,
      }),
    }),
  }),
});

export const { useGetCatalogRuleImpactedEmployeesQuery } =
  getCatalogRuleImpactedEmployees;
