import { companiesApi } from "../companiesApi";

export const cancelOffboardOrder = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    cancelOffboardOrder: build.mutation<
      ServerResponse<any>,
      { equipment_ids: string[]; companyId?: string; orderId?: string }
    >({
      query: ({ companyId, orderId, ...payload }) => ({
        url: `/${companyId}/offboard/orders/${orderId}`,
        method: "PATCH",
        data: { ...payload },
      }),
      invalidatesTags: [],
    }),
  }),
});

export const { useCancelOffboardOrderMutation } = cancelOffboardOrder;
