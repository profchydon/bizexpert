import { assetsApi } from ".";

const toggleAssetFavourite = assetsApi.injectEndpoints({
  endpoints: (query) => ({
    addAssetFavourite: query.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        assetSpecId: string;
      }
    >({
      query: ({ companyId, assetSpecId }) => ({
        url: `/companies/${companyId}/assets/${assetSpecId}/favourite/add`,
        method: "POST",
      }),
      invalidatesTags: ["Assets"],
    }),
    removeAssetFavourite: query.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        assetSpecId: string;
      }
    >({
      query: ({ companyId, assetSpecId }) => ({
        url: `/companies/${companyId}/assets/${assetSpecId}/favourite/remove`,
        method: "POST",
      }),
      invalidatesTags: ["Assets"],
    }),
  }),
});

export const { useAddAssetFavouriteMutation, useRemoveAssetFavouriteMutation } =
  toggleAssetFavourite;
