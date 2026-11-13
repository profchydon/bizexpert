import { IService } from "@/types/services";
import { servicesApi } from ".";

const getAllServices = servicesApi.injectEndpoints({
  endpoints: (query) => ({
    getAllServices: query.query<
      ServerResponse<any>,
      {
        params?: {
          id: string | null;
        };
      }
    >({
      query: ({ params }) => ({
        url: `/services`,
        params,
      }),
      providesTags: ["Services"],
    }),
  }),
});

export const { useGetAllServicesQuery } = getAllServices;
