import { IMcpCredential } from "@/types/mcpCredential";
import { companiesApi } from "..";

const listMcpCredentials = companiesApi.injectEndpoints({
  endpoints: (query) => ({
    listMcpCredentials: query.query<
      ServerResponse<IMcpCredential[]>,
      { companyId: string; environment: string }
    >({
      query: ({ companyId, environment }) => ({
        url: `/${companyId}/mcp-credentials`,
        params: { environment },
      }),
      providesTags: ["McpCredentials"],
    }),
  }),
});

export const { useListMcpCredentialsQuery } = listMcpCredentials;
