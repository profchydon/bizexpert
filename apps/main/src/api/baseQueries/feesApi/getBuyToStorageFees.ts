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
  };
  unit_storage_fees?: {
    devices?: number;
    accessories?: number;
  };
};

interface GetOnboardFeeReq {
  companyId: string;
  service_type: "Onboarding";
  country_id: string;
  employee_country_id: string;
  orders: Orders;
}

const getBuyToStorageFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getBuyToStorageFees: query.query<ServerResponse<Orders>, GetOnboardFeeReq>({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/storage/buy-to`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetBuyToStorageFeesQuery } = getBuyToStorageFees;
