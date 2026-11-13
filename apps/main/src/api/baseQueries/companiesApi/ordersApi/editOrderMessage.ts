import { companiesApi } from "..";
import type {
  EditOrderMessagePayload,
  OrderMessage,
} from "@/types/orderMessage";

export interface EditOrderMessageArgs extends EditOrderMessagePayload {
  companyId: string;
  orderId: string;
  messageId: string;
}

const editOrderMessageApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    editOrderMessage: build.mutation<
      ServerResponse<OrderMessage>,
      EditOrderMessageArgs
    >({
      query: ({ companyId, orderId, messageId, ...body }) => ({
        url: `/${companyId}/orders/${orderId}/messages/${messageId}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["OrderMessages"],
    }),
  }),
});

export const { useEditOrderMessageMutation } = editOrderMessageApi;
