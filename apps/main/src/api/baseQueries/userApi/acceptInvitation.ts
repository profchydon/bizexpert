import { ICompany, IUser } from "@/types/auth";
import { userApi } from ".";
import { IEmployees } from "@/types/employees";

const acceptInvitation = userApi.injectEndpoints({
  endpoints: (query) => ({
    acceptInvitation: query.mutation<
      ServerResponse<{ user: IUser; company: ICompany }>,
      { payload: Partial<IEmployees>; code: string }
    >({
      query: ({ code, payload }) => ({
        url: `/users/invitation/register`,
        method: "POST",
        data: { code: code, ...payload },
      }),
    }),
  }),
});

export const { useAcceptInvitationMutation } = acceptInvitation;
