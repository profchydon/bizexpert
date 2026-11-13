import { companiesApi } from "../..";

export const revokeEmployeeAdmin = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    revokeEmployeeAdmin: build.mutation<
      ServerResponse<any>,
      { email: string; companyId?: string }
    >({
      query: ({ companyId, email }) => ({
        url: `/${companyId}/settings/users/revoke`,
        method: "PUT",
        data: { email },
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const { useRevokeEmployeeAdminMutation } = revokeEmployeeAdmin;
