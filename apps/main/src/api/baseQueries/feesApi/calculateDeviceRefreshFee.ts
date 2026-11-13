import { feesApi } from ".";

const calculateDeviceRefreshFee = feesApi.injectEndpoints({
  endpoints: (query) => ({
    calculateDeviceRefreshFee: query.query<
      ServerResponse<any>,
      { companyId: string } & Record<string, unknown>
    >({
      query: ({ companyId, ...payload }) => {
        return {
          url: `/${companyId}/fees/device-refresh`,
          method: "POST",
          data: payload,
        };
      },
      providesTags: ["Fees"],
    }),
  }),
});

export const {
  useCalculateDeviceRefreshFeeQuery,
  useLazyCalculateDeviceRefreshFeeQuery,
} = calculateDeviceRefreshFee;
