import {
  ActivationNangoIntegrationRequest,
  NangoConnectSessionRequest,
  NangoDisconnectRequest,
  NangoSyncRequest,
} from "@/types/integrations";
import { companiesApi } from "..";

export const nangoIntegrationsApi = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    nangoConnectSession: build.mutation<
      ServerResponse<{ token: string; connect_link: string }>,
      NangoConnectSessionRequest
    >({
      query: ({ companyId, provider }) => ({
        url: `/${companyId}/integrations/nango/connect-session`,
        method: "POST",
        data: { provider },
      }),
    }),
    activateNangoIntegration: build.mutation<
      ServerResponse<any>,
      ActivationNangoIntegrationRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/integrations/nango/activate`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Integrations"],
    }),
    disconnectNangoIntegration: build.mutation<
      ServerResponse<any>,
      NangoDisconnectRequest
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/integrations/nango/disconnect`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Integrations"],
    }),
    syncNangoIntegration: build.mutation<ServerResponse<any>, NangoSyncRequest>(
      {
        query: ({ companyId, payload }) => ({
          url: `/${companyId}/integrations/nango/sync`,
          method: "POST",
          data: payload,
        }),
        invalidatesTags: ["Integrations"],
      },
    ),
    nangoRoutingOptions: build.query<
      ServerResponse<{
        project_key?: Array<{ value: string; label: string }>;
        board_id?: Array<{ value: string; label: string }>;
      }>,
      { companyId: string; provider: string; connectionId: string }
    >({
      query: ({ companyId, provider, connectionId }) => ({
        url: `/${companyId}/integrations/nango/routing-options`,
        method: "POST",
        data: {
          provider,
          connection_id: connectionId,
        },
      }),
    }),
  }),
});

export const {
  useNangoConnectSessionMutation,
  useActivateNangoIntegrationMutation,
  useDisconnectNangoIntegrationMutation,
  useSyncNangoIntegrationMutation,
  useNangoRoutingOptionsQuery,
} = nangoIntegrationsApi;
