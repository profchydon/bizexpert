import { ICompany, IUser } from "@/types/auth";
import { userApi } from ".";
import { IEmployees } from "@/types/employees";

const getInvitedUser = userApi.injectEndpoints({
  endpoints: (query) => ({
    getInvitedUser: query.mutation<
      ServerResponse<IEmployees>,
      { code: string }
    >({
      query: ({ code }) => ({
        url: `/users/invitation/respond`,
        method: "POST",
        data: { code },
      }),
    }),
  }),
});

export const { useGetInvitedUserMutation } = getInvitedUser;
