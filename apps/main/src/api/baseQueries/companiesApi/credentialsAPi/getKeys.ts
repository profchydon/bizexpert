import { ICredentials } from "@/types/credential";
import { companiesApi } from "..";

const getKeys = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getKeys: query.query<
      ServerResponse<ICredentials>,
      { companyId: string; params?: { environment?: string | null } }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/api-keys`,
        params,
      }),
      providesTags: ["ApiKeys"],
    }),
  }),
});

export const { useGetKeysQuery, useLazyGetKeysQuery } = getKeys;
