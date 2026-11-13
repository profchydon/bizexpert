import { countriesApi } from ".";

const getBankDetails = countriesApi.injectEndpoints({
  endpoints: (query) => ({
    getBankDetails: query.query<ServerResponse<any>, { countryId: string }>({
      query: ({ countryId }) => ({
        url: `/${countryId}/bank-details`,
      }),
      providesTags: ["BankDetails"],
    }),
  }),
});

export const { useGetBankDetailsQuery, useLazyGetBankDetailsQuery } =
  getBankDetails;
