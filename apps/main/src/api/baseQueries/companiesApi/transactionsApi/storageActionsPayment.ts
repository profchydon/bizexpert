import { companiesApi } from "..";
import { invalidateCheckoutCart } from "./invalidateCheckoutCart";
import type { StorageActionFeePaymentMethod } from "@/api/baseQueries/feesApi/getStorageActionFees";
import type { StorageActionInitiateOrder } from "@/api/baseQueries/feesApi/storageActionFeeOrders";

export interface StorageActionsInitiateReq {
  payment_method: StorageActionFeePaymentMethod;
  country_id: string;
  redirect_url: string;
  order_note?: string;
  additional_recipients?: string[];
  orders: StorageActionInitiateOrder[];
}

export const storageActionsPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    storageActionsPayment: build.mutation<
      ServerResponse<{ link: string }>,
      StorageActionsInitiateReq & { companyId: string }
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/transactions/storage-actions/initiate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateCheckoutCart(dispatch);
        } catch {
          return;
        }
      },
    }),
  }),
});

export const { useStorageActionsPaymentMutation } = storageActionsPayment;
