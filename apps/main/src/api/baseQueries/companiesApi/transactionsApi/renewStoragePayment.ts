import { companiesApi } from "..";

interface Equipment {
  asset_pricing_id: string;
  quantity: number;
}

interface Order {
  equipment: Equipment[];
}

type Orders = {
  [equipmentId: string]: Order;
};

interface OnboardPaymentReq {
  service_type: "Onboarding";
  payment_method: string;
  country_id: string;
  employee_country_id: string;
  redirect_url: string;
  orders: Orders;
}

export const renewStoragePayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    renewStoragePayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: OnboardPaymentReq; companyId: string }
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/transactions/renew-storage/initiate`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useRenewStoragePaymentMutation } = renewStoragePayment;
