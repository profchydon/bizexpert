import { companiesApi } from "../..";

export const updateJoinRequestAutoApproval = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateJoinRequestAutoApproval: build.mutation<
      ServerResponse<any>,
      { companyId: string; auto_approve_join_requests: boolean }
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/join-requests/auto-approval`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useUpdateJoinRequestAutoApprovalMutation } =
  updateJoinRequestAutoApproval;
