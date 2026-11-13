import { companiesApi } from "..";

const updateJoinRequestStatus = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateJoinRequestStatus: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        is_approved: boolean;
        join_request_ids: string[];
      }
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/join-requests`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useUpdateJoinRequestStatusMutation } = updateJoinRequestStatus;
