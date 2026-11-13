export type I_IntegrationType =
  | "google-workspace"
  | "apple-business-manager"
  | "slack"
  | "microsoft-entra-id"
  | "microsoft-intune"
  | "bob";

export interface I_Configuration {
  sync_frequency: string;
  excluded_emails: string[];
}

interface I_IntegrationGoogleActivation {
  code: string;
  domain: string;
  company_id: string;
  integration_id: string;
  configuration: I_Configuration;
}
interface I_IntegrationMicrosoftEntraActivation {
  code: string;
  company_id: string;
  integration_id: string;
  configuration: I_Configuration;
}
interface I_IntegrationFinchActivation {
  code: string;
  company_id: string;
  integration_id: string;
  configuration: I_Configuration;
}

interface I_IntegrationAbmActivation {
  company_id: string;
  integration_id: string;
  other_details: I_OtherAbmDetails;
}

export type I_OtherAbmDetails = {
  orgId: string;
};

interface I_UpdateLiveIntegration {
  configuration: I_Configuration;
}

export type ActivationIntegrationRequest = {
  companyId: string;
  payload: I_IntegrationGoogleActivation;
};

export type ActivationMicrosoftEntraIntegrationRequest = {
  companyId: string;
  payload: I_IntegrationMicrosoftEntraActivation;
};

export type ActivationFinchIntegrationRequest = {
  companyId: string;
  payload: I_IntegrationFinchActivation;
};

export type ActivateAbmIntegrationRequest = {
  companyId: string;
  integration_id: string;
  payload: I_IntegrationAbmActivation;
};

export type UpdateLiveIntegrationRequest = {
  companyId: string;
  integration_id: string;
  payload: I_UpdateLiveIntegration;
};

export type UpdateIntegrationStatusRequest = {
  companyId: string;
  integration_id: string;
  status: string;
};

export type I_Integration = {
  id: string;
  name: string;
  description: string;
  slug: string;
  service?: string;
  categories?: string[];
  rank: number;
  created_at: string;
  status: "Active" | "Inactive";
};

export type I_RsSyncStatus =
  | "pending"
  | "synced"
  | "failed"
  | "pending_disconnect";

export type I_LiveIntegrations = {
  id: string;
  company_id: string;
  integration_id: string;
  configuration: I_Configuration;
  other_details?: I_OtherAbmDetails | string;
  last_sync_at: string;
  domain: string;
  created_at: string;
  status: "Active" | "Inactive";
  nango_connection_id?: string | null;
  rs_sync_status?: I_RsSyncStatus | null;
  rs_sync_targets?: string[] | null;
  rs_sync_error?: string | null;
  rs_synced_at?: string | null;
  rs_sync_attempts?: number;
  integration: I_Integration;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

export type ActivationNangoIntegrationRequest = {
  companyId: string;
  payload: {
    provider: string;
    connection_id: string;
    project_key?: string;
    board_id?: string;
    sync_frequency?: string;
  };
};

export type NangoIntegrationConfiguration = {
  project_key?: string;
  board_id?: string;
  sync_frequency?: string;
};

export type NangoConnectSessionRequest = {
  companyId: string;
  provider: string;
};

export type NangoDisconnectRequest = {
  companyId: string;
  payload: {
    provider: string;
  };
};

export type NangoSyncRequest = {
  companyId: string;
  payload: {
    provider: string;
  };
};
