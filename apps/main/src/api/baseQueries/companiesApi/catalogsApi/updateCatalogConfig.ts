import { ICatalog } from "@/types/catalog";
import { companiesApi } from "..";

export const updateCatalogConfig = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateCatalogConfig: build.mutation<
      ServerResponse<ICatalog>,
      {
        auto_share: boolean;
        time_duration: string;
        time_limit: string;
        budget_limit: string;
        companyId: string;
        catalogId: string;
      }
    >({
      query: ({ companyId, catalogId, ...rest }) => ({
        url: `/${companyId}/catalogs/${catalogId}/configuration`,
        method: "PUT",
        data: { ...rest },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useUpdateCatalogConfigMutation } = updateCatalogConfig;
