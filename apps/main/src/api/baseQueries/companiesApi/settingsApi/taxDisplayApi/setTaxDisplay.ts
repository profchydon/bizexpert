import { companiesApi } from "../..";
import { ISetTaxDisplayMode, ITaxContextPayload } from "@/types/tax";

import { invalidateTaxPriceCaches } from "./invalidateTaxPriceCaches";

const setTaxDisplay = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    setTaxDisplay: build.mutation<
      ServerResponse<ITaxContextPayload>,
      ISetTaxDisplayMode
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/settings/tax-display`,
        method: "POST",
        data: payload,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          invalidateTaxPriceCaches(dispatch);
        } catch {
          // Leave cached prices untouched when the save fails.
        }
      },
    }),
  }),
});

export const { useSetTaxDisplayMutation } = setTaxDisplay;
