import { authApi } from ".";

export const resendOtp = authApi.injectEndpoints({
  endpoints: (build) => ({
    resendOtp: build.mutation<ServerResponse<{}>, { email: string }>({
      query: (data) => ({
        url: "/otp",
        method: "POST",
        data,
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useResendOtpMutation } = resendOtp;
