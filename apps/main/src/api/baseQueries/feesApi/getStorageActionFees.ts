import type { FeeSummaryLike } from "@/lib/tax/feeSummary";
import { feesApi } from ".";
import type {
  StorageActionFeeOrder,
  StorageActionFeePaymentMethod,
} from "./storageActionFeeOrders";

export type { StorageActionFeeOrder, StorageActionFeePaymentMethod };

export interface StorageActionFeesData {
  fee_summary?: FeeSummaryLike;
}

export interface GetStorageActionFeesReq {
  companyId: string;
  payment_method: StorageActionFeePaymentMethod;
  country_id: string;
  orders: StorageActionFeeOrder[];
}

export const getStorageActionFees = feesApi.injectEndpoints({
  endpoints: (query) => ({
    getStorageActionFees: query.query<
      ServerResponse<StorageActionFeesData>,
      GetStorageActionFeesReq
    >({
      query: ({ companyId, ...payload }) => ({
        url: `/${companyId}/fees/storage/actions`,
        method: "POST",
        data: payload,
      }),
      providesTags: ["Fees"],
    }),
  }),
});

export const { useGetStorageActionFeesQuery } = getStorageActionFees;
