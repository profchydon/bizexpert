import { feesApi } from ".";

interface Equipment {
  asset_pricing_id: string;
  quantity: number;
}

interface Order {
  equipment: Equipment[];
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
    currency?: {
      symbol?: string;
      code?: string;
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

const getStorageOnboardingFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getStorageOnboardingFees: query.query<
      ServerResponse<Orders>,
      GetOnboardFeeReq
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/storage/onboarding`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetStorageOnboardingFeesQuery } = getStorageOnboardingFees;
