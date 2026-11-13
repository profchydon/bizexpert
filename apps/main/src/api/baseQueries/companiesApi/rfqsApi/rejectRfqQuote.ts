import { companiesApi } from "..";

interface RejectRfqQuotePayload {
  companyId?: string;
  rfqId?: string;
  rfqResponseId?: string;
  clientRejectionReason?: string;
}

export const rejectRfqQuote = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    rejectRfqQuote: build.mutation<
      ServerResponse<unknown>,
      RejectRfqQuotePayload
    >({
      query: ({ companyId, rfqId, rfqResponseId, clientRejectionReason }) => ({
        url: `/${companyId}/rfqs/${rfqId}/rfq_response/${rfqResponseId}/reject`,
        method: "PUT",
        data: {
          client_rejection_reason: clientRejectionReason,
        },
      }),
      invalidatesTags: ["Order", "CatalogOrderRequests"],
    }),
  }),
});

export const { useRejectRfqQuoteMutation } = rejectRfqQuote;
