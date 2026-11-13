import { companiesApi } from "..";
import type { OrderMessagesPage } from "@/types/orderMessage";
import { unwrapMessagesPage } from "./messageHelpers";

export interface GetOrderMessagesParams {
  companyId: string;
  orderId: string;
  after_id?: string;
  since?: string;
}

export const getOrderMessagesApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    getOrderMessages: build.query<OrderMessagesPage, GetOrderMessagesParams>({
      query: ({ companyId, orderId, after_id, since }) => ({
        url: `/${companyId}/orders/${orderId}/messages`,
        params: { after_id, since },
      }),
      transformResponse: (
        response: ServerResponse<OrderMessagesPage> | OrderMessagesPage,
      ) => unwrapMessagesPage(response),
      providesTags: ["OrderMessages"],
    }),
  }),
});

export const { useGetOrderMessagesQuery } = getOrderMessagesApi;
