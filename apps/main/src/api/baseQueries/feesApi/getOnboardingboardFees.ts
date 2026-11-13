import { feesApi } from ".";

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
  fees?: {
    plan?: {
      fee_type?: string;
      service_type?: string;
      amount?: number;
    };
    items?: number;
    purchase_price?: number;
    additional_fee?: {
      storage_fee?: number;
      insurance_fee?: number;
    };
    total_fee?: number;
  };
}

type Orders = {
  [equipmentId: string]: Order;
} & {
  fee_summary?: {
    total_fee?: number;
    total_purchase_price?: number;
    total_onboarding_fee?: number;
    storage_fee?: number;
    insurance_fee?: number;
    platform_fee?: number;
    signature_requested?: boolean;
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
  };
};

interface GetOnboardFeeReq {
  companyId: string;
  service_type: "Onboarding";
  country_id: string;
  employee_country_id: string;
  orders: Orders;
}

const getOnboardingboardFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getOnboardingboardFees: query.query<
      ServerResponse<Orders>,
      GetOnboardFeeReq
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/onboarding`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetOnboardingboardFeesQuery } = getOnboardingboardFees;
