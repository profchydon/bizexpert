import { IAsset } from "@/types/assets";
import { companiesApi } from "..";
import { ICatalog } from "@/types/catalog";

const getCatalogAssets = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getCatalogAssets: query.query<
      ServerPaginatedResponse<IAsset[]>,
      { companyId: string; page?: number; catalogId: string }
    >({
      query: ({ companyId, page, catalogId }) => ({
        url: `/${companyId}/catalogs/${catalogId}/assets`,
        params: { page },
      }),
      providesTags: ["Catalogs"],
    }),
  }),
});

export const { useGetCatalogAssetsQuery } = getCatalogAssets;
