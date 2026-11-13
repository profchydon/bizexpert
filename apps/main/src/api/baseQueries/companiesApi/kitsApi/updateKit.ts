import { companiesApi } from "..";
import type { IKit, IUpdateKitRequest } from "@/types/kit";

export const updateKit = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateKit: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; kitId: string; payload: IUpdateKitRequest }
    >({
      query: ({ companyId, kitId, payload }) => ({
        url: `/${companyId}/kits/${kitId}`,
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: (_result, _error, { kitId }) => [
        { type: "Kits", id: kitId },
        "Kits",
      ],
    }),
  }),
});

export const { useUpdateKitMutation } = updateKit;
