import { IAssetCategory } from "@/types/assets";
import { assetsApi } from ".";

const getAssetTypes = assetsApi.injectEndpoints({
  endpoints: (query) => ({
    getAssetTypes: query.query<ServerResponse<IAssetCategory[]>, void>({
      query: () => ({
        url: `/assets/types`,
      }),
      providesTags: ["Assets"],
    }),
  }),
});

export const { useGetAssetTypesQuery } = getAssetTypes;
