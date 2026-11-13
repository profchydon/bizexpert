import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const addAssetsToCatalog = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    addAssetsToCatalog: query.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        catalogId: string;
        asset_pricing_ids: string[];
      }
    >({
      query: ({ companyId, catalogId, asset_pricing_ids }) => ({
        url: `/${companyId}/catalogs/${catalogId}/assets`,
        method: "POST",
        data: { asset_pricing_ids },
      }),
      invalidatesTags: ["Catalogs"],
    }),
  }),
});

export const { useAddAssetsToCatalogMutation } = addAssetsToCatalog;
