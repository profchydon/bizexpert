import { IOnboardingProgress, PlanSlug } from "@/types/onboarding";
import { companiesApi } from "..";

const selectOnboardingPlan = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    selectOnboardingPlan: build.mutation<
      ServerResponse<IOnboardingProgress>,
      { companyId: string; plan_slug: PlanSlug }
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/onboarding/plan`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["Onboarding", "Subscription"],
    }),
  }),
});

export const { useSelectOnboardingPlanMutation } = selectOnboardingPlan;
