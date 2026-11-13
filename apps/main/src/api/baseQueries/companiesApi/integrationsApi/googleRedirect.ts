import { companiesApi } from "..";

export const googleRedirect = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    googleRedirect: build.query<ServerResponse<any>, { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/${companyId}/integrations/google/redirect`,
      }),
    }),
  }),
});

export const { useGoogleRedirectQuery, useLazyGoogleRedirectQuery } =
  googleRedirect;
