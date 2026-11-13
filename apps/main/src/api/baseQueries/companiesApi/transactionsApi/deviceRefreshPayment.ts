import { companiesApi } from "..";

export const deviceRefreshPayment = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    deviceRefreshPayment: build.mutation<
      ServerResponse<{ link: string }>,
      { payload: any; companyId: string }
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/transactions/device-refresh/initiate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const { useDeviceRefreshPaymentMutation } = deviceRefreshPayment;
