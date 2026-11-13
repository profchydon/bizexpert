import { companiesApi } from "..";

export const microsoftEntraRedirect = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    microsoftEntraRedirect: build.query<
      ServerResponse<any>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/integrations/entra/redirect`,
      }),
    }),
  }),
});

export const {
  useMicrosoftEntraRedirectQuery,
  useLazyMicrosoftEntraRedirectQuery,
} = microsoftEntraRedirect;
