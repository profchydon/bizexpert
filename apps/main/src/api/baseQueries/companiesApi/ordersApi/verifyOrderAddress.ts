import { companiesApi } from "..";

export interface VerifyOrderSubOrderPayload {
  id: string;
  verification_contexts?: string[];
}

interface VerifyOrderAddressRequest {
  companyId: string;
  orderId: string;
  suborders: VerifyOrderSubOrderPayload[];
}

export const verifyOrderAddress = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    verifyOrderAddress: build.mutation<
      ServerResponse<any>,
      VerifyOrderAddressRequest
    >({
      query: ({ companyId, orderId, suborders }) => ({
        url: `/${companyId}/orders/${orderId}/verification/verify`,
        method: "POST",
        data: { suborders },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useVerifyOrderAddressMutation } = verifyOrderAddress;
