import { ICompany, IImpersonationSession, IUser } from "@/types/auth";
import { authApi } from ".";

export const impersonationConfirm = authApi.injectEndpoints({
  endpoints: (build) => ({
    impersonationConfirm: build.mutation<
      ServerResponse<{
        auth_token: string;
        user: IUser;
        company: ICompany;
        impersonation: IImpersonationSession;
      }>,
      { code: string }
    >({
      query: (data) => ({
        url: `/sessions/impersonation/confirm`,
        method: "POST",
        data,
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useImpersonationConfirmMutation } = impersonationConfirm;
