import { IOnboardingProgress } from "@/types/onboarding";
import { companiesApi } from "..";

const getOnboardingProgress = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getOnboardingProgress: query.query<
      ServerResponse<IOnboardingProgress>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/onboarding`,
      }),
      providesTags: ["Onboarding"],
    }),
  }),
});

export const { useGetOnboardingProgressQuery } = getOnboardingProgress;
