export interface IAgentConfig {
  company_id: string;
  sync_interval_seconds: number;
  created_at?: string;
  updated_at?: string;
}

export type ISetAgentConfig = {
  companyId: string;
  payload: {
    sync_interval_seconds: number;
  };
};
