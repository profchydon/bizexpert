import { feesApi } from ".";

interface Equipment {
  equipment_id: string;
  quantity: number;
  storage?: boolean;
  resale?: boolean;
  reassign?: boolean;
}

interface Order {
  equipment: Equipment[];
  fees?: {
    plan: {
      fee_type: string;
      service_type: string;
      amount: string;
    };
    additional_fee: {
      storage_fee: number;
      reassign_fee: number;
      resale_fee: number;
    };
    total_fee: number;
  };
}

type Orders = {
  [orderId: string]: Order;
} & {
  fee_summary?: {
    reassign_fee?: number;
    resale_fee?: number;
    storage_fee?: number;
    total_fee?: number;
    currency: {
      symbol: string;
      code: string;
    };
  };
};

interface GetOffboardFeeReq {
  companyId: string;
  service_type: "Offboarding";
  country_id: string;
  orders: Orders;
}

const getOffboardFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getOffboardFees: query.query<ServerResponse<Orders>, GetOffboardFeeReq>({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/offboarding`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetOffboardFeesQuery, useLazyGetOffboardFeesQuery } =
  getOffboardFees;
