import { companiesApi } from "..";
import type { CancellationPreviewResponse } from "./getCancellationPreview";

interface CancelOrderPayload {
  companyId?: string;
  orderId?: string;
  reason: string;
  additional_details: string;
  employee_ids?: string[];
  suborder_ids?: string[];
}

export interface CancelOrderResponse {
  instant?: boolean;
  refund_preview?: CancellationPreviewResponse["refund_preview"];
  refund_status?: string;
  order?: unknown;
}

export const cancelOrder = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    cancelOrder: build.mutation<
      ServerResponse<CancelOrderResponse>,
      CancelOrderPayload
    >({
      query: ({ companyId, orderId, ...payload }) => ({
        url: `/${companyId}/orders/${orderId}/cancel`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCancelOrderMutation } = cancelOrder;
