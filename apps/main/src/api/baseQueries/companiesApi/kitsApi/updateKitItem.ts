import { companiesApi } from "..";
import type { IKit, IUpdateKitItemRequest } from "@/types/kit";

export const updateKitItem = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateKitItem: build.mutation<
      ServerResponse<IKit>,
      {
        companyId: string;
        kitId: string;
        itemId: string;
        payload: IUpdateKitItemRequest;
      }
    >({
      query: ({ companyId, kitId, itemId, payload }) => ({
        url: `/${companyId}/kits/${kitId}/items/${itemId}`,
        method: "PUT",
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

export const { useUpdateKitItemMutation } = updateKitItem;
