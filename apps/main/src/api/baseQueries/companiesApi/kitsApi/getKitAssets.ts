import { companiesApi } from "..";
import type { IKitAssetsParams } from "@/types/kit";

const getKitAssets = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKitAssets: query.query<
      ServerResponse<any>,
      { companyId: string; kitId: string; params?: IKitAssetsParams }
    >({
      query: ({ companyId, kitId, params }) => ({
        url: `/${companyId}/kits/${kitId}/assets`,
        params,
      }),
      providesTags: (_result, _error, { kitId }) => [
        { type: "KitAssets", id: kitId },
        "KitAssets",
      ],
    }),
  }),
});

export const { useGetKitAssetsQuery, useLazyGetKitAssetsQuery } = getKitAssets;
