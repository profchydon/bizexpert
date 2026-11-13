import { IOrder } from "@/types/orders";
import { companiesApi } from "..";

const getOrders = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOrders: query.query<
      ServerPaginatedResponse<IOrder[]>,
      {
        companyId?: string;
        params?: {
          search?: string | null;
          page?: number;
          per_page?: number;
          status?: string | null;
          type?: string | null;
          country?: string | null;
          from?: string | null;
          to?: string | null;
          subsidiary_id?: string;
        };
      }
    >({
      query: ({ companyId, params }) => ({
        url: `/${companyId}/orders`,
        params,
      }),
      providesTags: ["Order"],
    }),
  }),
});

export const { useGetOrdersQuery, useLazyGetOrdersQuery } = getOrders;
