import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const removeAssetsToCatalog = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    removeAssetsToCatalog: query.mutation<
      ServerResponse<ICatalog>,
      {
        companyId: string;
        catalogId: string;
        asset_pricing_ids: string[];
      }
    >({
      query: ({ companyId, catalogId, asset_pricing_ids }) => ({
        url: `/${companyId}/catalogs/${catalogId}/assets`,
        method: "DELETE",
        data: { asset_pricing_ids },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useRemoveAssetsToCatalogMutation } = removeAssetsToCatalog;
