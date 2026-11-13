import { authApi } from ".";

export const loginAuthorization = authApi.injectEndpoints({
  endpoints: (build) => ({
    loginAuthorization: build.mutation<
      ServerResponse<{ redirect_url: string }>,
      void
    >({
      query: () => ({
        url: `/sessions/authorization`,
        method: "GET",
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useLoginAuthorizationMutation } = loginAuthorization;
