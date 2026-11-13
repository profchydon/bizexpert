import { companiesApi } from "../..";
import { IAgentConfig, ISetAgentConfig } from "@/types/agentConfig";

export const setAgentConfig = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    setAgentConfig: build.mutation<
      ServerResponse<IAgentConfig>,
      ISetAgentConfig
    >({
      query: ({ companyId, payload }) => ({
        url: `/${companyId}/settings/agent-config`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useSetAgentConfigMutation } = setAgentConfig;
