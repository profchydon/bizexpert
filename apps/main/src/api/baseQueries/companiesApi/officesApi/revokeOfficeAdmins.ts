import { companiesApi } from "..";

const revokeOfficeAdmins = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    revokeOfficeAdmins: build.mutation<
      ServerResponse<unknown>,
      {
        companyId: string;
        officeId: string;
        payload: { user_id?: string; email?: string };
      }
    >({
      query: ({ companyId, officeId, payload }) => ({
        url: `/${companyId}/offices/${officeId}/admins/revoke`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
      ],
    }),
  }),
});

export const { useRevokeOfficeAdminsMutation } = revokeOfficeAdmins;
