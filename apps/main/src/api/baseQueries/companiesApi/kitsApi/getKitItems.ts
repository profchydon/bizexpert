import { companiesApi } from "..";
import type { IKitItemListParams, IKitItemListPayload } from "@/types/kit";

const getKitItems = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKitItems: query.query<
      ServerResponse<IKitItemListPayload>,
      { companyId: string; kitId: string; params?: IKitItemListParams }
    >({
      query: ({ companyId, kitId, params }) => ({
        url: `/${companyId}/kits/${kitId}/items`,
        params,
      }),
      providesTags: (_result, _error, { kitId }) => [
        { type: "KitItems", id: kitId },
        "KitItems",
      ],
    }),
  }),
});

export const { useGetKitItemsQuery, useLazyGetKitItemsQuery } = getKitItems;
