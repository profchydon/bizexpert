import { companiesApi } from "..";

const getJoinRequests = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getJoinRequests: query.query<ServerResponse<any>, { companyId?: string }>({
      query: ({ companyId }) => ({
        url: `/${companyId}/join-requests`,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetJoinRequestsQuery } = getJoinRequests;
