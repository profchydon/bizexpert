import { companiesApi } from "..";
import { ActivationIntegrationRequest } from "@/types/integrations";

export const activateGoogleIntegration = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    activateGoogleIntegration: build.mutation<
      ServerResponse<any>,
      ActivationIntegrationRequest
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/integrations/google/activate`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useActivateGoogleIntegrationMutation } =
  activateGoogleIntegration;
