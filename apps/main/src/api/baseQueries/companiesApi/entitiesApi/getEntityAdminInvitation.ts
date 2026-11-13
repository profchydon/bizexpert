import { companiesApi } from "..";
import type { EntityAdminInvitation } from "./entityAdminInvitationTypes";

const getEntityAdminInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getEntityAdminInvitation: build.query<
      ServerResponse<EntityAdminInvitation>,
      { code: string }
    >({
      query: ({ code }) => ({
        url: `/admin-invitations/${code}`,
        skipAuth: true,
      }),
    }),
  }),
});

export const {
  useGetEntityAdminInvitationQuery,
  useLazyGetEntityAdminInvitationQuery,
} = getEntityAdminInvitation;
