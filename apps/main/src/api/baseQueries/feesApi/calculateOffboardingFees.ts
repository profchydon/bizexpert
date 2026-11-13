import { CalculateOffboardingFeesRequest } from "@/types/offboarding";
import { feesApi } from ".";

export const calculateOffboardingFees = feesApi.injectEndpoints({
  endpoints: (build) => ({
    calculateOffboardingFees: build.mutation<
      ServerResponse<any>,
      { companyId: string; payload: CalculateOffboardingFeesRequest["payload"] }
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/fees/offboarding`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: [],
    }),
  }),
});

export const { useCalculateOffboardingFeesMutation } = calculateOffboardingFees;
