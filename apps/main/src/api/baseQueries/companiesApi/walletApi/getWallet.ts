import { companiesApi } from "..";

export const getWallet = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getWallet: build.query<ServerResponse<any>, { companyId: string }>({
      query: ({ companyId }) => ({
        url: `/${companyId}/wallet`,
      }),
    }),
  }),
});

export const { useGetWalletQuery } = getWallet;
