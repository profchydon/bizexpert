import { companiesApi } from "..";
import type { IKit } from "@/types/kit";

export const unarchiveKit = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    unarchiveKit: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; kitId: string }
    >({
      query: ({ companyId, kitId }) => ({
        url: `/${companyId}/kits/${kitId}/unarchive`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { kitId }) => [
        { type: "Kits", id: kitId },
        "Kits",
      ],
    }),
  }),
});

export const { useUnarchiveKitMutation } = unarchiveKit;
