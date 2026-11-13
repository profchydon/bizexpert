import { IAssetCategory } from "@/types/assets";
import { assetsApi } from ".";

const getAssetCategories = assetsApi.injectEndpoints({
  endpoints: (query) => ({
    getAssetCategories: query.query<ServerResponse<IAssetCategory[]>, void>({
      query: () => ({
        url: `/assets/categories`,
      }),
      providesTags: ["Assets"],
    }),
  }),
});

export const { useGetAssetCategoriesQuery } = getAssetCategories;
