import { companiesApi } from "..";
import type { IKitListPayload } from "@/types/kit";
import type { CompanyCatalogArgs } from "./types";

const getCatalogPolicyKits = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogPolicyKits: build.query<
      ServerResponse<IKitListPayload>,
      CompanyCatalogArgs & { params?: { page?: number; per_page?: number } }
    >({
      query: ({ companyId, catalogId, params }) => ({
        url: `/${companyId}/catalog-policies/${catalogId}/kits`,
        params,
      }),
      providesTags: ["Kits"],
    }),
  }),
});

export const { useGetCatalogPolicyKitsQuery } = getCatalogPolicyKits;
