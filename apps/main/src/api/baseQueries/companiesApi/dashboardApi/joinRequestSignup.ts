import { companiesApi } from "..";

export const joinRequestSignup = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    joinRequestSignup: build.mutation<
      ServerResponse<any>,
      {
        companyId: string;
        payload: {
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          password: string;
          address: string;
          job_title: string;
          employment_title: string;
        };
      }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/join-requests/signup`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Dashboard"],
    }),
  }),
});

export const { useJoinRequestSignupMutation } = joinRequestSignup;
