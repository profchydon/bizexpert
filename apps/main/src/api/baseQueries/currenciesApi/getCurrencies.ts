import { currenciesApi } from ".";

const getCurrencies = currenciesApi.injectEndpoints({
  endpoints: (query) => ({
    getCurrencies: query.query<ServerResponse<any>, void>({
      query: () => ({
        url: ``,
      }),
      providesTags: ["Currencies"],
    }),
  }),
});

export const { useGetCurrenciesQuery, useLazyGetCurrenciesQuery } =
  getCurrencies;
