import { companiesApi } from "..";
import type { ServerOffice } from "@/types/offices";

const getDeliverableOffices = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getDeliverableOffices: query.query<
      ServerResponse<ServerOffice[]>,
      { companyId: string; country?: string }
    >({
      query: ({ companyId, country }) => ({
        url: `/${companyId}/offices/deliverable`,
        params: country ? { country } : undefined,
      }),
      providesTags: ["Offices"],
    }),
  }),
});

export const { useGetDeliverableOfficesQuery } = getDeliverableOffices;
