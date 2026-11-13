import { authApi } from ".";

export const verifyOtp = authApi.injectEndpoints({
  endpoints: (build) => ({
    verifyOtp: build.mutation<
      ServerResponse<{}>,
      { otp?: string; userId: string }
    >({
      query: (data) => ({
        url: "/otp",
        method: "PUT",
        data,
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useVerifyOtpMutation } = verifyOtp;
