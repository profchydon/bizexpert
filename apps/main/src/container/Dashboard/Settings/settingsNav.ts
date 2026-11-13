export type SettingsType =
  | "company-info"
  | "billing-and-tax"
  | "subscription"
  | "integrations"
  | "users"
  | "support"
  | "credentials"
  | "notification-settings"
  | "equipment-refresh";

export interface SettingsTab {
  id: SettingsType;
  label: string;
}

export const SETTINGS_TABS: SettingsTab[] = [
  { id: "company-info", label: "Company info." },
  { id: "billing-and-tax", label: "Billing and tax" },
  { id: "subscription", label: "Subscription" },
  { id: "integrations", label: "Integrations" },
  { id: "users", label: "Users" },
  { id: "support", label: "Support" },
  { id: "credentials", label: "Credentials" },
  { id: "notification-settings", label: "Notification Settings" },
  { id: "equipment-refresh", label: "Refresh cycles" },
];

export interface SettingsGroup {
  id: string;
  label: string;
  tabs: SettingsType[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    tabs: ["company-info", "users", "credentials", "support"],
  },
  {
    id: "finance",
    label: "Finance",
    tabs: ["billing-and-tax", "subscription"],
  },
  {
    id: "devices",
    label: "Devices",
    tabs: ["equipment-refresh"],
  },
  {
    id: "connections",
    label: "Connections",
    tabs: ["integrations", "notification-settings"],
  },
];

export const DEFAULT_SETTINGS_TYPE: SettingsType = "company-info";

const LEGACY_SETTINGS_TYPES: Record<string, SettingsType> = {
  apiKeys: "credentials",
  equipmentRefresh: "equipment-refresh",
  "resolve-scripts": "company-info",
};

const VALID_TYPES = new Set<string>(SETTINGS_TABS.map((tab) => tab.id));

export function resolveSettingsType(value: string | null): SettingsType {
  if (!value) return DEFAULT_SETTINGS_TYPE;
  if (LEGACY_SETTINGS_TYPES[value]) return LEGACY_SETTINGS_TYPES[value];
  if (VALID_TYPES.has(value)) return value as SettingsType;
  return DEFAULT_SETTINGS_TYPE;
}
