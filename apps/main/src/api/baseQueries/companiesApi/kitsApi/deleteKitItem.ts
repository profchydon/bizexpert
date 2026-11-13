import { companiesApi } from "..";
import type { IKit } from "@/types/kit";

export const deleteKitItem = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteKitItem: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; kitId: string; itemId: string }
    >({
      query: ({ companyId, kitId, itemId }) => ({
        url: `/${companyId}/kits/${kitId}/items/${itemId}`,
        method: "DELETE",
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

export const { useDeleteKitItemMutation } = deleteKitItem;
