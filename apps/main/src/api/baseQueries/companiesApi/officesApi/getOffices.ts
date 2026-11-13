import { companiesApi } from "..";
import type { ServerOffice } from "@/types/offices";

const getOffices = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOffices: query.query<
      ServerPaginatedResponse<ServerOffice[]>,
      {
        companyId: string;
        params?: {
          page?: number;
          per_page?: number;
        };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/offices`,
        params,
      }),
      providesTags: ["Offices"],
    }),
  }),
});

export const { useGetOfficesQuery, useLazyGetOfficesQuery } = getOffices;
