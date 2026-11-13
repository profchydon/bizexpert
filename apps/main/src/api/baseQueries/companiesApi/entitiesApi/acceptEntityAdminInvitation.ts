import { companiesApi } from "..";
import type { AcceptEntityAdminInvitationData } from "./entityAdminInvitationTypes";

const acceptEntityAdminInvitation = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    acceptEntityAdminInvitation: build.mutation<
      ServerResponse<AcceptEntityAdminInvitationData>,
      { code: string }
    >({
      query: ({ code }) => ({
        url: `/admin-invitations/${code}/accept`,
        method: "POST",
        skipAuth: true,
      }),
    }),
  }),
});

export const { useAcceptEntityAdminInvitationMutation } =
  acceptEntityAdminInvitation;
