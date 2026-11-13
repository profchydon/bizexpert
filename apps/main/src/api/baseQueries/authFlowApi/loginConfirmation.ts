import { ICompany, IUser } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import { authApi } from ".";

export const loginConfirmation = authApi.injectEndpoints({
  endpoints: (build) => ({
    loginConfirmation: build.mutation<
      ServerResponse<{
        auth_token: string;
        user: IUser;
        company: ICompany;
        entities?: EntityMembership[];
      }>,
      { code: string }
    >({
      query: (data) => ({
        url: `/sessions/confirmation`,
        method: "POST",
        data,
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useLoginConfirmationMutation } = loginConfirmation;
