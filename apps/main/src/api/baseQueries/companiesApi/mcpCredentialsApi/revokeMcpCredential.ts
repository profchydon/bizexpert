import { companiesApi } from "..";

const revokeMcpCredential = companiesApi.injectEndpoints({
  endpoints: (build) => ({
    revokeMcpCredential: build.mutation<
      ServerResponse<null>,
      { companyId: string; credentialId: string }
    >({
      query: ({ companyId, credentialId }) => ({
        url: `/${companyId}/mcp-credentials/${credentialId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["McpCredentials"],
    }),
  }),
});

export const { useRevokeMcpCredentialMutation } = revokeMcpCredential;
