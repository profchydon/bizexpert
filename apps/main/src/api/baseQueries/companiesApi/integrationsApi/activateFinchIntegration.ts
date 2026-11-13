import { ActivationFinchIntegrationRequest } from "@/types/integrations";
import { companiesApi } from "..";

export const activateFinchIntegration = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    activateFinchIntegration: build.mutation<
      ServerResponse<any>,
      ActivationFinchIntegrationRequest
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/integrations/finch/activate`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useActivateFinchIntegrationMutation } = activateFinchIntegration;
