import { IService } from "@/types/services";
import { servicesApi } from ".";

const getSingleService = servicesApi.injectEndpoints({
  endpoints: (query) => ({
    getSingleService: query.query<
      ServerResponse<IService>,
      {
        serviceId: string;
      }
    >({
      query: ({ serviceId }) => ({
        url: `/services/${serviceId}`,
      }),
      providesTags: ["Services"],
    }),
  }),
});

export const { useGetSingleServiceQuery } = getSingleService;
