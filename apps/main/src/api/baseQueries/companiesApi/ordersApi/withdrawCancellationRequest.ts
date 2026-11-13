import { companiesApi } from "..";

interface WithdrawPayload {
  companyId?: string;
  cancellationRequestId?: string;
}

export const withdrawCancellationRequestApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    withdrawCancellationRequest: build.mutation<
      ServerResponse<unknown>,
      WithdrawPayload
    >({
      query: ({ companyId, cancellationRequestId }) => ({
        url: `/${companyId}/orders/cancellation-requests/${cancellationRequestId}/undo`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useWithdrawCancellationRequestMutation } =
  withdrawCancellationRequestApi;
