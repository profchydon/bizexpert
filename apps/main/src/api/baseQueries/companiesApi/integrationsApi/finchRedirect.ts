import { companiesApi } from "..";
import { buildFinchRedirectPath } from "./finchRedirectPath";

export const finchRedirect = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    finchRedirect: build.query<
      ServerResponse<any>,
      { companyId: string; provider: string; return_to?: string }
    >({
      query: ({ companyId, provider, return_to }) => ({
        url: buildFinchRedirectPath({ companyId, provider, return_to }),
      }),
    }),
  }),
});

export const { useFinchRedirectQuery, useLazyFinchRedirectQuery } =
  finchRedirect;
