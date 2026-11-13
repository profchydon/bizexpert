import { authApi } from ".";

export const joinRequest = authApi.injectEndpoints({
  endpoints: (build) => ({
    joinRequest: build.mutation<
      ServerResponse<{}>,
      {
        companyId: string;
        email: string;
        first_name: string;
        last_name: string;
      }
    >({
      query: ({ companyId, ...data }) => ({
        url: `/companies/${companyId}/join-requests`,
        method: "POST",
        data,
        skipAuth: true,
      }),
      invalidatesTags: ["AuthApi"],
    }),
  }),
});

export const { useJoinRequestMutation } = joinRequest;
