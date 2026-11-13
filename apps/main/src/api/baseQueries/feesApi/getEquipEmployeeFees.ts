import { feesApi } from ".";

export interface EquipEmployeeFeeAsset {
  asset_pricing_id: string;
  quantity: number;
  fulfillment_date?: string;
}

export interface EquipEmployeeFeeEquipment {
  equipment_id: string;
  quantity: number;
  fulfillment_date?: string;
}

export interface EquipEmployeeFeeOrder {
  employee_country_id: string;
  assets?: EquipEmployeeFeeAsset[];
  equipment?: EquipEmployeeFeeEquipment[];
}

export interface EquipEmployeeFeeSummary {
  total_fee?: number;
  total_purchase_price?: number;
  total_onboarding_fee?: number;
  storage_fee?: number;
  insurance_fee?: number;
  platform_fee?: number;
  currency?: {
    symbol?: string;
    code?: string;
  };
  savings?: {
    amount?: number;
    currency?: string | null;
    is_subscribed?: boolean;
    basis?: string;
  };
  [key: string]: unknown;
}

export interface EquipEmployeeFeesData {
  fee_summary?: EquipEmployeeFeeSummary;
  [key: string]: unknown;
}

export interface GetEquipEmployeeFeesReq {
  companyId: string;
  country_id: string;
  payment_method?: "Card" | "Credit";
  orders: Record<string, EquipEmployeeFeeOrder>;
}

export type EquipEmployeeFeesBody = Omit<GetEquipEmployeeFeesReq, "companyId">;

const getEquipEmployeeFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getEquipEmployeeFees: query.query<
      ServerResponse<EquipEmployeeFeesData>,
      GetEquipEmployeeFeesReq
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/onboarding/equip-employee`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetEquipEmployeeFeesQuery } = getEquipEmployeeFees;
