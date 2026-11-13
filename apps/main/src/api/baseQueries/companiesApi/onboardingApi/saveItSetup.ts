import {
  IOnboardingItSetupRequest,
  IOnboardingProgress,
} from "@/types/onboarding";
import { companiesApi } from "..";

const saveOnboardingItSetup = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    saveOnboardingItSetup: build.mutation<
      ServerResponse<IOnboardingProgress>,
      { companyId: string } & IOnboardingItSetupRequest
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/onboarding/it-setup`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});

export const { useSaveOnboardingItSetupMutation } = saveOnboardingItSetup;
