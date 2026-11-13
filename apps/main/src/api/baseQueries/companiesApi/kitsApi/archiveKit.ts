import { companiesApi } from "..";
import type { IKit } from "@/types/kit";

export const archiveKit = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    archiveKit: build.mutation<
      ServerResponse<IKit>,
      { companyId: string; kitId: string }
    >({
      query: ({ companyId, kitId }) => ({
        url: `/${companyId}/kits/${kitId}/archive`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, { kitId }) => [
        { type: "Kits", id: kitId },
        "Kits",
      ],
    }),
  }),
});

export const { useArchiveKitMutation } = archiveKit;
