import { companiesApi } from "..";
import { UpdateIntegrationStatusRequest } from "@/types/integrations";

export const updateIntegrationStatus = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    updateIntegrationStatus: build.mutation<
      ServerResponse<any>,
      UpdateIntegrationStatusRequest
    >({
      query: ({ companyId, integration_id, status }) => {
        return {
          url: `/${companyId}/integrations/${integration_id}?status=${status}`,
          method: "PUT",
        };
      },
      invalidatesTags: ["Integrations"],
    }),
  }),
});

export const { useUpdateIntegrationStatusMutation } = updateIntegrationStatus;
