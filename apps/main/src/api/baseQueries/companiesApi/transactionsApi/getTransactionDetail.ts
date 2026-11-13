import { companiesApi } from "..";
import { GetTransactionDetailResponse } from "@/types/transactions";

const getTransactionDetail = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactionDetail: build.query<
      GetTransactionDetailResponse,
      { companyId?: string; transactionId?: string }
    >({
      query: ({ companyId, transactionId }) => ({
        url: `/${companyId}/transactions/${transactionId}`,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetTransactionDetailQuery } = getTransactionDetail;
