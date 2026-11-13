import {
  IOnboardingHardwareComplianceRequest,
  IOnboardingProgress,
} from "@/types/onboarding";
import { companiesApi } from "..";

const saveOnboardingHardwareCompliance = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    saveOnboardingHardwareCompliance: build.mutation<
      ServerResponse<IOnboardingProgress>,
      { companyId: string } & IOnboardingHardwareComplianceRequest
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/onboarding/hardware-compliance`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});

export const { useSaveOnboardingHardwareComplianceMutation } =
  saveOnboardingHardwareCompliance;
