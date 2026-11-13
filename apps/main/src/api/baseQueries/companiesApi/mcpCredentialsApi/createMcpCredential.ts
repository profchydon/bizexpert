import { IMcpCredentialWithSecret, McpScope } from "@/types/mcpCredential";
import { companiesApi } from "..";

const createMcpCredential = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    createMcpCredential: build.mutation<
      ServerResponse<IMcpCredentialWithSecret>,
      {
        companyId: string;
        name: string;
        environment: string;
        scopes: McpScope[];
      }
    >({
      query: ({ companyId, ...rest }) => ({
        url: `/${companyId}/mcp-credentials`,
        method: "POST",
        data: { ...rest },
      }),
      invalidatesTags: ["McpCredentials"],
    }),
  }),
});

export const { useCreateMcpCredentialMutation } = createMcpCredential;
