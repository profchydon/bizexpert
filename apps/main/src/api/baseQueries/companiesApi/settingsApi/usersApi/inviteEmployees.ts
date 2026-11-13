import { IInviteEmployeesRequest } from "@/types/employees";
import { companiesApi } from "../..";

export const inviteEmployees = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    inviteEmployees: build.mutation<
      ServerResponse<any>,
      IInviteEmployeesRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/settings/users/invite`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Invitations"],
    }),
  }),
});

export const { useInviteEmployeesMutation } = inviteEmployees;
