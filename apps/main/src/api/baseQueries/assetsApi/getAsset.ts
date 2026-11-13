import { IAsset, ISpecification } from "@/types/assets";
import { assetsApi } from ".";

const getAsset = assetsApi.injectEndpoints({
  endpoints: (query) => ({
    getAsset: query.query<
      ServerResponse<IAsset>,
      { companyId: string; country_id?: string; assetId: string }
    >({
      query: ({ companyId, assetId, ...params }) => ({
        url: `/companies/${companyId}/assets/${assetId}`,
        params,
      }),
      providesTags: ["Assets"],
      transformResponse(baseQueryReturnValue: ServerResponse<IAsset>) {
        const specs = baseQueryReturnValue?.data?.specifications?.map(
          (spec) => {
            const decodedProps = spec?.spec;

            return {
              ...spec,
              spec: Object.keys(decodedProps).map((key) => {
                return {
                  name: key.charAt(0).toUpperCase() + key.slice(1),
                  value: decodedProps[key as any] as unknown as string,
                };
              }),
            };
          },
        ) as ISpecification[];

        const newResData = {
          ...baseQueryReturnValue,
          data: {
            ...baseQueryReturnValue.data,
            specifications: specs,
          },
        } as ServerResponse<IAsset>;

        return newResData;
      },
    }),
  }),
});

export const { useGetAssetQuery } = getAsset;
