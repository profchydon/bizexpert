import {
  IOnboardingAboutRequest,
  IOnboardingProgress,
} from "@/types/onboarding";
import { companiesApi } from "..";

const saveOnboardingAbout = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    saveOnboardingAbout: build.mutation<
      ServerResponse<IOnboardingProgress>,
      { companyId: string } & IOnboardingAboutRequest
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/onboarding/about`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});

export const { useSaveOnboardingAboutMutation } = saveOnboardingAbout;
