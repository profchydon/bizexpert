import { companiesApi } from "../..";
import { IAgentConfig } from "@/types/agentConfig";

export const resetAgentConfig = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    resetAgentConfig: build.mutation<
      ServerResponse<IAgentConfig>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/settings/agent-config`,
        method: "DELETE",
        data: {},
      }),
    }),
  }),
});

export const { useResetAgentConfigMutation } = resetAgentConfig;
