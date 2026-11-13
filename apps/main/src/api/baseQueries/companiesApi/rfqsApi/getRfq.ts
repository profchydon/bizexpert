import { companiesApi } from "..";
import { RfqRecord } from "./types";

const getRfq = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getRfq: build.query<
      ServerResponse<RfqRecord>,
      { companyId?: string; rfqId?: string; params?: { search?: string } }
    >({
      query: ({ companyId, rfqId, params }) => ({
        url: `/${companyId}/rfqs/${rfqId}`,
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetRfqQuery } = getRfq;
