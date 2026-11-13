import { companiesApi } from "../..";

export const getPendingInvitations = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getPendingInvitations: build.query<
      ServerPaginatedResponse<any>,
      { companyId: string; params?: { search?: string | null } }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/settings/invitations`,
        params,
      }),
      providesTags: ["Invitations"],
    }),
  }),
});

export const { useGetPendingInvitationsQuery } = getPendingInvitations;
