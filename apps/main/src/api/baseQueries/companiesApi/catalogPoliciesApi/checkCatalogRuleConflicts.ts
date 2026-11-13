import { companiesApi } from "..";
import type { CatalogRuleConflictsPayload } from "@/types/catalogPolicy";
import type {
  CheckCatalogRuleConflictsPayload,
  CompanyCatalogArgs,
} from "./types";

const checkCatalogRuleConflicts = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    checkCatalogRuleConflicts: build.mutation<
      ServerResponse<CatalogRuleConflictsPayload>,
      CompanyCatalogArgs & { payload: CheckCatalogRuleConflictsPayload }
    >({
      query: ({ companyId, catalogId, payload }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/rules/check-conflicts`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useCheckCatalogRuleConflictsMutation } =
  checkCatalogRuleConflicts;
