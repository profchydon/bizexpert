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

export interface OnboardOfficeOrder {
  office_id: string;
  contact_employee_id: string;
  office_country_id: string;
  assets: Equipment[];
}

interface OnboardPaymentReq {
  service_type: "Onboarding";
  payment_method: string;
  country_id: string;
  employee_country_id?: string;
  shipping_fee?: number;
  redirect_url: string;
  orders?: Orders;
  office_orders?: OnboardOfficeOrder[];
  additional_recipients?: string[];
}

export const onboardingPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    onboardingPayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: OnboardPaymentReq; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/onboard/initiate`,
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

export const { useOnboardingPaymentMutation } = onboardingPayment;
