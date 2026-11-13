import { companiesApi } from "..";

const verifyOrderPayment = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    verifyOrderPayment: query.query<
      ServerResponse<any>,
      { companyId?: string; tx_ref?: string }
    >({
      query: ({ companyId, tx_ref }) => ({
        url: `/${companyId}/transactions/${tx_ref}/verify`,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useVerifyOrderPaymentQuery } = verifyOrderPayment;
