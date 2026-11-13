import { companiesApi } from "..";
import type { IKit } from "@/types/kit";

export const activateKit = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    activateKit: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; kitId: string }
    >({
      query: ({ companyId, kitId }) => ({
        url: `/${companyId}/kits/${kitId}/activate`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { kitId }) => [
        { type: "Kits", id: kitId },
        "Kits",
      ],
    }),
  }),
});

export const { useActivateKitMutation } = activateKit;
