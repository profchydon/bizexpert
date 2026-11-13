import { feesApi } from ".";

interface Equipment {
  equipment_id: string;
  quantity: number;
  storage_duration: string;
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

interface GetRenewStorageFeeFeeReq {
  companyId: string;
  service_type: "Storage";
  country_id: string;
  orders: Orders;
}

const getRenewStorageFee = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getRenewStorageFee: query.query<
      ServerResponse<Orders>,
      GetRenewStorageFeeFeeReq
    >({
      query: ({ companyId, ...payload }) => {
        return {
          url: `/${companyId}/fees/storage/renew`,
          method: "POST",
          data: payload,
        };
      },
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetRenewStorageFeeQuery, useLazyGetRenewStorageFeeQuery } =
  getRenewStorageFee;
