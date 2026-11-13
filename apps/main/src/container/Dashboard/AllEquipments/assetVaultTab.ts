import routes from "@/routes";

export const DISCOVERED_TAB_ENABLED = false;
export const FLEET_INSIGHTS_BUTTON_ENABLED = false;

export type AssetVaultTab = "equipment" | "discovered" | "archived" | "refresh";

export const resolveAssetVaultTab = (
  searchParams: Pick<URLSearchParams, "get">,
): AssetVaultTab => {
  if (searchParams.get("device-refresh") === "true") return "refresh";
  if (searchParams.get("tab") === "archived") return "archived";
  if (DISCOVERED_TAB_ENABLED && searchParams.get("tab") === "discovered") {
    return "discovered";
  }
  return "equipment";
};

export const assetVaultTabHref = (
  tab: AssetVaultTab,
  entityId?: string | null,
): string => {
  const resolvedTab =
    tab === "discovered" && !DISCOVERED_TAB_ENABLED ? "equipment" : tab;
  const path =
    resolvedTab === "refresh"
      ? `${routes.All_Equipments}?device-refresh=true`
      : resolvedTab === "archived"
        ? `${routes.All_Equipments}?tab=archived`
        : resolvedTab === "discovered"
          ? `${routes.All_Equipments}?tab=discovered`
          : routes.All_Equipments;

  if (!entityId) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}entity=${encodeURIComponent(entityId)}`;
};
