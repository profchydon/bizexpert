import { ICompany } from "@/types/auth";
import { companiesApi } from "..";

export const signAgreement = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    signAgreement: build.mutation<
      ServerResponse<ICompany>,
      { companyId?: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/agreement`,
        method: "PUT",
      }),
      invalidatesTags: ["Agreement"],
    }),
  }),
});

export const { useSignAgreementMutation } = signAgreement;
