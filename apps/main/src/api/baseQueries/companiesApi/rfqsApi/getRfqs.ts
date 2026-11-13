import { companiesApi } from "..";
import { GetRfqsParams, RfqListResponseData } from "./types";

const getRfqs = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getRfqs: build.query<
      ServerResponse<RfqListResponseData>,
      { companyId?: string; params?: GetRfqsParams }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/rfqs`,
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetRfqsQuery, useLazyGetRfqsQuery } = getRfqs;
