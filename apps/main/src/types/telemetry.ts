export type TelemetryComplianceResult = {
  check_id: string;
  status: string;
};

export type TelemetrySnapshot = {
  device_id?: string;
  collected_at?: string;
  os_name?: string | null;
  os_version?: string | null;
  os_build?: string | null;
  hostname?: string | null;
  serial_number?: string | null;
  agent_version?: string | null;
  disk_encrypted?: boolean | null;
  disk_total_bytes?: number | null;
  disk_free_bytes?: number | null;
  ram_bytes?: number | null;
  total_memory?: string | null;
  memory_percent?: number | null;
  battery_percent?: number | null;
  battery_condition?: string | null;
  battery_cycle_count?: number | null;
  battery_max_capacity_percent?: number | null;
  battery_charging_status?: string | null;
  last_restart_at?: string | null;
  last_boot_up_time?: string | null;
  uptime_seconds?: number | null;
  days_since_restart?: number | null;
  compliance_pass_count?: number;
  compliance_fail_count?: number;
  compliance_results?: TelemetryComplianceResult[];
  installed_software?: Array<Record<string, unknown>>;
  os_update?: {
    status?: string;
    pending_update_count?: number;
    latest_available_version?: string;
  } | null;
  running_activity?: {
    groups?: Array<{
      name?: string;
      memory_bytes?: number;
      instance_count?: number;
    }>;
  } | null;
};

export type TelemetryDeviceFlags = {
  no_agent: boolean;
  revoked: boolean;
  reporting: boolean;
  stale: boolean;
};

export type TelemetryDeviceAgent = {
  id: string;
  status: string;
  last_seen_at: string | null;
  stopped_at?: string | null;
  stopped_by?: string | null;
};

export type TelemetryAssigneeContact = {
  name: string;
  email: string;
  initials: string;
};

export type TelemetryInstallRequest = {
  requested_at: string | null;
  last_sent_at: string | null;
  send_count: number;
};

export type TelemetryIssueAction = {
  issue_key: string;
  paused_at: string | null;
  ignored_at: string | null;
};

export type TelemetryComplianceHistory = {
  days: number;
  last_report_at: string | null;
  checks: Array<{
    key: string;
    days: Array<"pass" | "fail" | "not_verified" | "no_data">;
    current: "pass" | "fail" | "not_verified";
  }>;
};

export type TelemetryDevice = {
  equipment_id: string;
  device_id: string | null;
  title: string;
  serial_number: string | null;
  type: string;
  company_id: string;
  office_id: string | null;
  owner_type: string | null;
  owner_id: string | null;
  telemetry_ownership?: string | null;
  assignee: string | null;
  assignee_contact?: TelemetryAssigneeContact | null;
  agent: TelemetryDeviceAgent | null;
  telemetry: TelemetrySnapshot | null;
  flags: TelemetryDeviceFlags;
  install_request?: TelemetryInstallRequest | null;
  issue_actions?: TelemetryIssueAction[];
  compliance_history?: TelemetryComplianceHistory | null;
  metric_sample_count?: number;
};

export type FleetPosture = {
  passing_checks: number;
  applicable_checks: number;
  reporting_devices: number;
  pass_rate: number | null;
};

export type FleetControlTrend = {
  direction: "up" | "down" | "steady";
  points_delta: number | null;
};

export type FleetControlItem = {
  key?: string;
  check_id?: string;
  pass_count?: number;
  fail_count?: number;
  unknown_count?: number;
  not_applicable_count?: number;
  pass_rate?: number | null;
  trend?: FleetControlTrend;
  platforms?: FleetControlPlatform[];
};

export type FleetControlPlatform = {
  platform?: string;
  mechanism?: string;
  pass_count?: number;
  total_count?: number;
};

export type FleetControlsPayload = {
  controls: FleetControlItem[];
  posture: FleetPosture;
};

export type FleetStats = {
  vault_count: number;
  reporting_count: number;
  no_agent_count: number;
  revoked_count: number;
  stale_count: number;
  needs_attention_count: number;
};

export type FleetSummary = {
  device_count: number;
  avg_memory_percent: number | null;
  avg_disk_percent: number | null;
  encrypted_device_count: number;
  devices_with_failing_compliance: number;
};

export type FleetScope = {
  company_id: string;
  account_wide: boolean;
  office_ids: string[] | null;
};

export type FleetTelemetryPayload = {
  summary: FleetSummary;
  controls: FleetControlsPayload;
  devices: TelemetryDevice[];
  stats: FleetStats;
  scope: FleetScope;
};

export type FleetSummaryPayload = Omit<FleetTelemetryPayload, "devices">;

export type TelemetryDevicesPage = {
  items: TelemetryDevice[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
};
