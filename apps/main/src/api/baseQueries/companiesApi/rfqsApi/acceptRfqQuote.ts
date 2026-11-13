import { companiesApi } from "..";

interface AcceptRfqQuotePayload {
  companyId?: string;
  rfqId?: string;
  rfqResponseId?: string;
  deviceIds: string[];
}

export const acceptRfqQuote = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    acceptRfqQuote: build.mutation<
      ServerResponse<unknown>,
      AcceptRfqQuotePayload
    >({
      query: ({ companyId, rfqId, rfqResponseId, deviceIds }) => ({
        url: `/${companyId}/rfqs/${rfqId}/rfq_response/${rfqResponseId}/accept`,
        method: "PUT",
        data: {
          device_ids: deviceIds,
        },
      }),
      invalidatesTags: ["Order", "CatalogOrderRequests"],
    }),
  }),
});

export const { useAcceptRfqQuoteMutation } = acceptRfqQuote;
