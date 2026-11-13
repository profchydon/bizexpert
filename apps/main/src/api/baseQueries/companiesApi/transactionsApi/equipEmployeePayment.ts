import { companiesApi } from "..";
import { invalidateCheckoutCart } from "./invalidateCheckoutCart";

export interface EquipEmployeeInitiateAsset {
  asset_pricing_id: string;
  quantity: number;
  device_setup?: string;
  fulfillment_date?: string;
  signature_requested?: boolean;
  note?: string;
}

export interface EquipEmployeeInitiateEquipment {
  equipment_id: string;
  quantity: number;
  device_setup?: string;
  fulfillment_date?: string;
  signature_requested?: boolean;
  note?: string;
}

export interface EquipEmployeeInitiateOrder {
  employee_country_id: string;
  assets?: EquipEmployeeInitiateAsset[];
  equipment?: EquipEmployeeInitiateEquipment[];
}

export interface EquipEmployeeOfficeOrder {
  office_id: string;
  contact_employee_id: string;
  office_country_id: string;
  assets: EquipEmployeeInitiateAsset[];
}

export interface EquipEmployeeInitiateReq {
  payment_method: "Card" | "Bank" | "Credit";
  country_id: string;
  redirect_url: string;
  orders?: Record<string, EquipEmployeeInitiateOrder>;
  office_orders?: EquipEmployeeOfficeOrder[];
  additional_recipients?: string[];
  order_note?: string;
}

export const equipEmployeePayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    equipEmployeePayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: EquipEmployeeInitiateReq; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/onboard/equip-employee/initiate`,
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

export const { useEquipEmployeePaymentMutation } = equipEmployeePayment;
