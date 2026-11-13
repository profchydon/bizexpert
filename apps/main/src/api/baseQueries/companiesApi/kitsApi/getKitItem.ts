import { companiesApi } from "..";
import type { IKitItem } from "@/types/kit";

const getKitItem = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKitItem: query.query<
      ServerResponse<IKitItem>,
      { companyId: string; kitId: string; itemId: string }
    >({
      query: ({ companyId, kitId, itemId }) => ({
        url: `/${companyId}/kits/${kitId}/items/${itemId}`,
      }),
      providesTags: (_result, _error, { kitId, itemId }) => [
        { type: "KitItems", id: `${kitId}-${itemId}` },
        "KitItems",
      ],
    }),
  }),
});

export const { useGetKitItemQuery, useLazyGetKitItemQuery } = getKitItem;
