import { companiesApi } from "..";
import type { IKit } from "@/types/kit";

const getKit = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKit: query.query<
      ServerResponse<IKit>,
      { companyId: string; kitId: string }
    >({
      query: ({ companyId, kitId }) => ({
        url: `/${companyId}/kits/${kitId}`,
      }),
      providesTags: (_result, _error, { kitId }) => [
        { type: "Kits", id: kitId },
        "Kits",
      ],
    }),
  }),
});

export const { useGetKitQuery, useLazyGetKitQuery } = getKit;
