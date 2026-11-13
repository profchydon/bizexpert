import { companiesApi } from "..";
import { invalidateCheckoutCart } from "./invalidateCheckoutCart";

interface Equipment {
  asset_pricing_id: string;
  employee_id: string;
  quantity: number;
  fulfillment_date: string;
  device_setup: string;
  note: string;
  storage?: boolean;
  storage_duration: string;
}

interface Order {
  assets: Equipment[];
}

type Orders = {
  [equipmentId: string]: Order;
};

interface OnboardPaymentReq {
  service_type: "Onboarding";
  payment_method: string;
  country_id: string;
  employee_country_id: string;
  shipping_fee: number;
  redirect_url: string;
  orders: Orders;
  additional_recipients?: string[];
}

export const buyToStoragePayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    buyToStoragePayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: OnboardPaymentReq; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/buy-to-storage/initiate`,
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

export const { useBuyToStoragePaymentMutation } = buyToStoragePayment;
