import { companiesApi } from "..";

const getJoinRequestUserDetails = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getJoinRequestUserDetails: build.query<
      ServerResponse<any>,
      { companyId: string; joinRequestId: string }
    >({
      query: ({ companyId, joinRequestId }) => ({
        url: `/${companyId}/join-requests/${joinRequestId}/user-details`,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetJoinRequestUserDetailsQuery,
  useLazyGetJoinRequestUserDetailsQuery,
} = getJoinRequestUserDetails;
