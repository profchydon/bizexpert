import { ICompany, IUser } from "@/types/auth";
import { authApi } from ".";
import { buildSignupRequest, SignupRequest } from "./buildSignupRequest";

export const signup = authApi.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<
      ServerResponse<{ user?: IUser; company?: ICompany }>,
      SignupRequest
    >({
      query: buildSignupRequest,
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useSignupMutation } = signup;
