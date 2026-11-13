import routes from "@/routes";

export type SettingsType = "profile" | "roles" | "whatsapp";

export interface SettingsTab {
  id: SettingsType;
  label: string;
}

export interface SettingsGroup {
  id: string;
  label: string;
  tabs: SettingsTab[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: "account",
    label: "Account",
    tabs: [{ id: "profile", label: "Profile" }],
  },
  {
    id: "users",
    label: "Users",
    tabs: [{ id: "roles", label: "Roles" }],
  },
  {
    id: "integrations",
    label: "Integrations",
    tabs: [{ id: "whatsapp", label: "WhatsApp" }],
  },
];

export function settingsPath(type: SettingsType): string {
  if (type === "roles") return routes.SETTINGS_ROLES;
  if (type === "whatsapp") return `${routes.SETTINGS}?tab=whatsapp`;
  return routes.SETTINGS;
}

export const resolveSettingsType = (
  val: string | null | undefined,
  pathname?: string | null,
): SettingsType => {
  if (pathname?.startsWith(routes.SETTINGS_ROLES)) return "roles";
  if (val === "whatsapp") return "whatsapp";
  if (val === "roles") return "roles";
  return "profile";
};
