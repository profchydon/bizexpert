import { companiesApi } from "..";
import { UpdateLiveIntegrationRequest } from "@/types/integrations";

export const updateLiveIntegration = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateLiveIntegration: build.mutation<
      ServerResponse<any>,
      UpdateLiveIntegrationRequest
    >({
      query: ({ companyId, integration_id, payload }) => {
        return {
          url: `/${companyId}/integrations/live/${integration_id}`,
          method: "PUT",
          data: payload,
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useUpdateLiveIntegrationMutation } = updateLiveIntegration;
