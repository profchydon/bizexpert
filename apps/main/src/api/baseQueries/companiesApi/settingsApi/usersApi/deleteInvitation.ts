import { companiesApi } from "../..";

export const deleteInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deleteInvitation: build.mutation<
      ServerResponse<any>,
      { email: string; companyId?: string }
    >({
      query: ({ companyId, email }) => ({
        url: `/${companyId}/settings/users/revoke`,
        method: "PUT",
        data: { email },
      }),
      invalidatesTags: ["Invitations"],
    }),
  }),
});

export const { useDeleteInvitationMutation } = deleteInvitation;
