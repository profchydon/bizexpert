import { companiesApi } from "..";

interface CancelSubOrderPayload {
  companyId?: string;
  orderId?: string;
  subOrderId?: string;
  reason: string;
  additional_details: string;
  include_related_items?: boolean;
}

export const cancelSubOrder = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    cancelSubOrder: build.mutation<ServerResponse<any>, CancelSubOrderPayload>({
      query: ({ companyId, orderId, subOrderId, ...payload }) => ({
        url: `/${companyId}/orders/${orderId}/sub-orders/${subOrderId}/cancel`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useCancelSubOrderMutation } = cancelSubOrder;
