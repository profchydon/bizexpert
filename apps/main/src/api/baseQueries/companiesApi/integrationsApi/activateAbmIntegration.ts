import { companiesApi } from "..";
import { ActivateAbmIntegrationRequest } from "@/types/integrations";

export const activateAbmIntegration = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    activateAbmIntegration: build.mutation<
      ServerResponse<any>,
      ActivateAbmIntegrationRequest
    >({
      query: ({ companyId, payload }) => {
        return {
          url: `/${companyId}/integrations/abm/activate`,
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useActivateAbmIntegrationMutation } = activateAbmIntegration;
