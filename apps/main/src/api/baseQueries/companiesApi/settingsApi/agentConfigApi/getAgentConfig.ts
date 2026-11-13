import { companiesApi } from "../..";
import { IAgentConfig } from "@/types/agentConfig";

const getAgentConfig = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    getAgentConfig: query.query<
      ServerResponse<IAgentConfig>,
      { companyId: string }
    >({
      query: ({ companyId }) => ({
        url: `/${companyId}/settings/agent-config`,
      }),
    }),
  }),
});

export const { useGetAgentConfigQuery } = getAgentConfig;
