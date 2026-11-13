import { companiesApi } from "..";
import { TransactionRequest } from "@/types/transactions";

export const orderPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    orderPayment: build.mutation<ServerResponse<any>, TransactionRequest>({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/initiate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useOrderPaymentMutation } = orderPayment;
