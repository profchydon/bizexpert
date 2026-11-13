import { companiesApi } from "..";
import { TransactionRequest } from "@/types/transactions";

export const paySubscription = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    paySubscription: build.mutation<
      ServerResponse<{ link: string }>,
      {
        payment_method: string;
        country_id: string;
        shipping_fee: number;
        redirect_url: string;
        plan_pricing_id: string;
        companyId: string;
      }
    >({
      query: ({ companyId, ...rest }) => ({
        url: `/${companyId}/transactions/subscription/initiate`,
        method: "POST",
        data: rest,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const { usePaySubscriptionMutation } = paySubscription;
