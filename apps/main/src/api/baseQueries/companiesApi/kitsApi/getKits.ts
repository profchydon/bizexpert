import { companiesApi } from "..";
import type { IKitListParams, IKitListPayload } from "@/types/kit";

const getKits = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKits: query.query<
      ServerResponse<IKitListPayload>,
      { companyId: string; params?: IKitListParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/kits`,
        params,
      }),
      providesTags: ["Kits"],
    }),
  }),
});

export const { useGetKitsQuery, useLazyGetKitsQuery } = getKits;
