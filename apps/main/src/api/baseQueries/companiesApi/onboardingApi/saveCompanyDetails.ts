import {
  IOnboardingCompanyDetailsRequest,
  IOnboardingProgress,
} from "@/types/onboarding";
import { companiesApi } from "..";

const saveOnboardingCompanyDetails = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    saveOnboardingCompanyDetails: build.mutation<
      ServerResponse<IOnboardingProgress>,
      { companyId: string } & IOnboardingCompanyDetailsRequest
    >({
      query: ({ companyId, ...data }) => ({
        url: `/${companyId}/onboarding/company-details`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
  }),
});

export const { useSaveOnboardingCompanyDetailsMutation } =
  saveOnboardingCompanyDetails;
