import { companiesApi } from "..";
import { ActivationMicrosoftEntraIntegrationRequest } from "@/types/integrations";

export const activateMicrosoftEntraIntegration = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    activateMicrosoftEntraIntegration: build.mutation<
      ServerResponse<any>,
      ActivationMicrosoftEntraIntegrationRequest
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/integrations/entra/activate`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useActivateMicrosoftEntraIntegrationMutation } =
  activateMicrosoftEntraIntegration;
