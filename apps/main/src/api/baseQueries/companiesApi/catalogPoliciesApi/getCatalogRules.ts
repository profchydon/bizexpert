import { companiesApi } from "..";
import type {
  CatalogRuleListParams,
  CatalogRuleListPayload,
} from "@/types/catalogPolicy";
import type { CompanyCatalogArgs } from "./types";

const getCatalogRules = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogRules: build.query<
      ServerResponse<CatalogRuleListPayload>,
      CompanyCatalogArgs & { params?: CatalogRuleListParams }
    >({
      query: ({ companyId, catalogId, params }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules`,
        params,
      }),
      providesTags: ["CatalogRules"],
    }),
  }),
});

export const { useGetCatalogRulesQuery } = getCatalogRules;
