import { IService } from "@/types/services";
import { servicesApi } from ".";

const getServiceCountry = servicesApi.injectEndpoints({
  endpoints: (query) => ({
    getServiceCountry: query.query<
      ServerResponse<{ services: IService[] }>,
      {
        countryId: string;
      }
    >({
      query: ({ countryId }) => ({
        url: `/services/country/${countryId}`,
      }),
      providesTags: ["Services"],
    }),
  }),
});

export const { useGetServiceCountryQuery, useLazyGetServiceCountryQuery } =
  getServiceCountry;
