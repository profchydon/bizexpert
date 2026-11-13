import { companiesApi } from "../..";
import { ITaxContextPayload } from "@/types/tax";

const getTaxDisplay = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getTaxDisplay: query.query<
      ServerResponse<ITaxContextPayload>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/settings/tax-display`,
      }),
      providesTags: ["TaxDisplay"],
    }),
  }),
});

export const { useGetTaxDisplayQuery } = getTaxDisplay;
