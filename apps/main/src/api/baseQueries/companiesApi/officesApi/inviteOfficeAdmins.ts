import { companiesApi } from "..";

const inviteOfficeAdmins = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    inviteOfficeAdmins: build.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        officeId: string;
        payload: { admin_user_ids?: string[]; admin_emails?: string[] };
      }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/admins/invite`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
      ],
    }),
  }),
});

export const { useInviteOfficeAdminsMutation } = inviteOfficeAdmins;
