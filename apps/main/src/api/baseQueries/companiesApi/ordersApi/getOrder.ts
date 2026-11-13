import { IOrder } from "@/types/orders";
import { companiesApi } from "..";

const getOrders = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOrder: query.query<
      ServerResponse<IOrder>,
      { companyId?: string; orderId?: string }
    >({
      query: ({ companyId, orderId }) => ({
        url: `/${companyId}/orders/${orderId}`,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetOrderQuery } = getOrders;
