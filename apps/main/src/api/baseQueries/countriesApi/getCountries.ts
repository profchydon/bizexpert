import { countriesApi } from ".";

const getCountries = countriesApi.injectEndpoints({
  endpoints: (query) => ({
    getCountries: query.query<ServerResponse<any>, void>({
      query: () => ({
        url: ``,
      }),
      providesTags: ["Countries"],
    }),
  }),
});

export const { useGetCountriesQuery, useLazyGetCountriesQuery } = getCountries;
