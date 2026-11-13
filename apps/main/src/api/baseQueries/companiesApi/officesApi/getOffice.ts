import { companiesApi } from "..";
import type { ServerOfficeDetail } from "@/types/offices";

const getOffice = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOffice: query.query<
      ServerResponse<ServerOfficeDetail>,
      { companyId: string; officeId: string }
    >({
      query: ({ companyId, officeId }) => ({
        url: `/${companyId}/offices/${officeId}`,
      }),
      providesTags: (result, error, { officeId }) => [
        { type: "Office", id: officeId },
      ],
    }),
  }),
});

export const { useGetOfficeQuery } = getOffice;
