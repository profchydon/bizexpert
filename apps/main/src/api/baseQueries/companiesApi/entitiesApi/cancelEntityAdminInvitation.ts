import { companiesApi } from "..";

const cancelEntityAdminInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    cancelEntityAdminInvitation: build.mutation<
      ServerResponse<unknown>,
      { entityId: string; invitationId: string }
    >({
      query: ({ entityId, invitationId }) => ({
        url: `/${entityId}/admin-invitations/${invitationId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { entityId }) => [
        "Invitations",
        { type: "Invitations", id: entityId },
      ],
    }),
  }),
});

export const { useCancelEntityAdminInvitationMutation } =
  cancelEntityAdminInvitation;
