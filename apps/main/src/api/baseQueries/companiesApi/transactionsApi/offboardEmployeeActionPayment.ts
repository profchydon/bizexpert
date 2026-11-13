import { companiesApi } from "..";

interface Equipment {
  equipment_id: string;
  quantity: number;
  collection_date: { start: string; end: string } | string;
  signature_requested?: boolean;
  storage?: boolean;
  reassign?: boolean;
  resale?: boolean;
  dispose?: boolean;
  factory_reset?: boolean;
  duration?: string;
  assignee?: string;
  estimated_value?: number | string;
}

type Orders = {
  [employeeId: string]: { total_fee: number | string; equipment: Equipment[] };
};

interface OffboardPaymentReq {
  payment_method: string;
  country_id: string;
  redirect_url: string;
  orders: Orders;
  order_note?: string;
  additional_recipients?: string[];
}

export const offboardEmployeeActionPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    offboardEmployeeActionPayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: OffboardPaymentReq; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/offboard/employee/initiate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useOffboardEmployeeActionPaymentMutation } =
  offboardEmployeeActionPayment;
