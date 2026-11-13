import { companiesApi } from "..";
import type { EntityAdminInviteRequest } from "./entityAdminInvitation";

const inviteEntityAdmins = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    inviteEntityAdmins: build.mutation<
      ServerResponse<unknown>,
      { entityId: string; body: EntityAdminInviteRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}/admins/invite`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result, error, { entityId }) => [
        "Entities",
        { type: "Entities", id: entityId },
        "Invitations",
        { type: "Invitations", id: entityId },
      ],
    }),
  }),
});

export const { useInviteEntityAdminsMutation } = inviteEntityAdmins;
