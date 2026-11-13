export type McpScope = "mcp:read" | "mcp:transact";

export type McpEnvironment = "test" | "live";

export interface IMcpCredential {
  id: string;
  company_id: string;
  created_by: string | null;
  name: string;
  environment: McpEnvironment;
  client_id: string;
  scopes: McpScope[];
  revoked: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IMcpCredentialWithSecret extends IMcpCredential {
  client_secret: string;
}
