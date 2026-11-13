import { companiesApi } from "..";
import type { EntityAdminInvitation } from "./entityAdminInvitation";

const getEntityAdminInvitations = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEntityAdminInvitations: build.query<
      ServerResponse<
        EntityAdminInvitation[] | { data: EntityAdminInvitation[] }
      >,
      { entityId: string }
    >({
      query: ({ entityId }) => ({
        url: `/${entityId}/admin-invitations`,
        params: { per_page: 100 },
      }),
      providesTags: (result, error, { entityId }) => [
        { type: "Invitations", id: entityId },
        "Invitations",
      ],
    }),
  }),
});

export const { useGetEntityAdminInvitationsQuery } = getEntityAdminInvitations;
