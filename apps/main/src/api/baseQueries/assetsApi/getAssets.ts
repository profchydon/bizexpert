import { IAsset, ISpec } from "@/types/assets";
import { assetsApi } from ".";

const getAssets = assetsApi.injectEndpoints({
  endpoints: (query) => ({
    getAssets: query.query<
      ServerPaginatedResponse<IAsset[]>,
      {
        companyId: string;
        [key: string]: string | number | boolean | undefined;
        country_id?: string;
        min_price?: string;
        max_price?: string;
        storage?: string;
        hard_drive?: string;
        RAM?: string;
        ram?: string;
        os?: string;
        processor?: string;
        display?: string;
        keyboard?: string;
        power_adapter?: string;
        warranty?: string;
        spec_tier?: string;
        colour?: string;
        state?: string;
        type?: string;
        category?: string;
        favourites?: boolean;
        page?: number;
        per_page?: number;
        search?: string;
      }
    >({
      query: ({ companyId, ...params }) => ({
        url: `/companies/${companyId}/assets`,
        params,
      }),
      providesTags: ["Assets"],
      transformResponse(
        baseQueryReturnValue: ServerPaginatedResponse<IAsset[]>,
      ) {
        const newAssetsRes = baseQueryReturnValue.data?.["data"]?.map(
          (asset) => {
            const convertToSpecToArray = Object.keys(asset.spec).map((key) => {
              return {
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: asset.spec[key as any] as unknown as string,
              };
            }) as ISpec[];

            return {
              ...asset,
              spec: convertToSpecToArray,
            } as IAsset;
          },
        );
        const newResData = {
          ...baseQueryReturnValue,
          data: {
            ...baseQueryReturnValue.data,
            data: newAssetsRes,
          },
        } as ServerPaginatedResponse<IAsset[]>;
        return newResData;
      },
    }),
  }),
});

export const { useGetAssetsQuery, useLazyGetAssetsQuery } = getAssets;
