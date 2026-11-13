import { companiesApi } from "..";

interface Equipment {
  equipment_id: string;
  quantity: number;
  collection_date: { start: string; end: string };
  archive?: boolean;
  storage?: boolean;
  resale?: boolean;
  reassign?: boolean;
}

type Orders = {
  [key: string]: { equipment: Equipment[]; total_fee: string };
};

interface OffboardPaymentReq {
  payment_method: string;
  country_id: string;
  redirect_url: string;
  order: Orders;
}

export const offboardActionPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    offboardActionPayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: OffboardPaymentReq; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/offboard/initiate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useOffboardActionPaymentMutation } = offboardActionPayment;
