import { GetAllTransactionResponse } from "@/types/transactions";
import { companiesApi } from "..";

export const getTransactions = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query<
      GetAllTransactionResponse,
      {
        companyId?: string;
        params?: {
          type?: string | null;
          invoice?: "all" | "paid" | "unpaid";
          page?: number;
          per_page?: number;
        };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/transactions`,
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetTransactionsQuery, useLazyGetTransactionsQuery } =
  getTransactions;
