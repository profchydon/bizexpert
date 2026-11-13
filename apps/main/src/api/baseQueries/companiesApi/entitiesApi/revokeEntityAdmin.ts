import { companiesApi } from "..";
import type { RevokeEntityAdminRequest } from "./entityAdminInvitation";

const revokeEntityAdmin = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    revokeEntityAdmin: build.mutation<
      ServerResponse<unknown>,
      { entityId: string; body: RevokeEntityAdminRequest }
    >({
      query: ({ entityId, body }) => ({
        url: `/${entityId}/admins/revoke`,
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

export const { useRevokeEntityAdminMutation } = revokeEntityAdmin;
