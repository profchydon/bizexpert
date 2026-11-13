import { companiesApi } from "..";

export const verifyFinchCode = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    verifyFinchCode: build.query<
      ServerResponse<any>,
      { companyId: string; code: string }
    >({
      query: ({ companyId, code }) => ({
        url: `/${companyId}/integrations/finch/verify?code=${code}`,
      }),
    }),
  }),
});

export const { useVerifyFinchCodeQuery, useLazyVerifyFinchCodeQuery } =
  verifyFinchCode;
