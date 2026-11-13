import { companiesApi } from "..";

interface MarkOrderMessagesReadArgs {
  companyId: string;
  orderId: string;
}

const markOrderMessagesReadApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    markOrderMessagesRead: build.mutation<unknown, MarkOrderMessagesReadArgs>({
      query: ({ companyId, orderId }) => ({
        url: `/${companyId}/orders/${orderId}/messages/read`,
        method: "POST",
      }),
    }),
  }),
});

export const { useMarkOrderMessagesReadMutation } = markOrderMessagesReadApi;
