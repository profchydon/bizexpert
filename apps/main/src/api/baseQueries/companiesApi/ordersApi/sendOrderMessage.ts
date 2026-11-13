import { companiesApi } from "..";
import { getOrderMessagesApi } from "./getOrderMessages";
import {
  buildMessageFormData,
  buildOptimisticMessage,
  quotedFrom,
  scheduleObjectUrlCleanup,
} from "./messageHelpers";
import type {
  OrderMessage,
  SendOrderMessagePayload,
} from "@/types/orderMessage";

export interface SendOrderMessageArgs extends SendOrderMessagePayload {
  companyId: string;
  orderId: string;
}

const sendOrderMessageApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    sendOrderMessage: build.mutation<
      ServerResponse<OrderMessage>,
      SendOrderMessageArgs
    >({
      query: ({ companyId, orderId, ...payload }) => ({
        url: `/${companyId}/orders/${orderId}/messages`,
        method: "POST",
        data: buildMessageFormData(payload),
        params: { excludePathFromEncryption: true },
      }),
      invalidatesTags: ["OrderMessages"],
      async onQueryStarted(
        { companyId, orderId, ...payload },
        { dispatch, queryFulfilled },
      ) {
        const objectUrls: string[] = [];
        const patch = dispatch(
          getOrderMessagesApi.util.updateQueryData(
            "getOrderMessages",
            { companyId, orderId },
            (draft) => {
              const quoted = quotedFrom(draft.data, payload.quoted_message_id);
              draft.data.push(
                buildOptimisticMessage(payload, quoted, objectUrls),
              );
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        } finally {
          scheduleObjectUrlCleanup(objectUrls);
        }
      },
    }),
  }),
});

export const { useSendOrderMessageMutation } = sendOrderMessageApi;
