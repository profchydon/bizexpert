import { companiesApi } from "..";
import type { IAddKitItemsRequest, IKitItemListPayload } from "@/types/kit";

export const addKitItems = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    addKitItems: build.mutation<
      ServerResponse<IKitItemListPayload>,
      { companyId: string; kitId: string; payload: IAddKitItemsRequest }
    >({
      query: ({ companyId, kitId, payload }) => ({
        url: `/${companyId}/kits/${kitId}/items`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { kitId }) => [
        { type: "KitItems", id: kitId },
        { type: "Kits", id: kitId },
        "KitItems",
        "Kits",
      ],
    }),
  }),
});

export const { useAddKitItemsMutation } = addKitItems;
