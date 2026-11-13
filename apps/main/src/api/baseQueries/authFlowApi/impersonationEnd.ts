import { IImpersonationSession } from "@/types/auth";
import { authApi } from ".";

export const impersonationEnd = authApi.injectEndpoints({
  endpoints: (build) => ({
    impersonationEnd: build.mutation<
      ServerResponse<null>,
      { impersonation?: IImpersonationSession }
    >({
      query: (data) => ({
        url: `/sessions/impersonation/end`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useImpersonationEndMutation } = impersonationEnd;
