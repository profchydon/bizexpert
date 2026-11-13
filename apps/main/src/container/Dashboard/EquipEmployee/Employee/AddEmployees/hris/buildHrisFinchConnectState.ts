import type { I_IntegrationType } from "@/types/integrations";
import { slug as integrationIcons } from "@/container/Dashboard/Settings/Integrations/integrationImages";
import type { HrisFinchManageState } from "./hrisFinchManageState";

type HrisCatalogIntegration = {
  id: string;
  name: string;
  description?: string;
  slug: string;
  service?: string;
};

export function buildHrisFinchConnectState(
  item: HrisCatalogIntegration,
  companyId: string,
  options?: { code?: string | null; integration?: string | null },
): HrisFinchManageState | null {
  if (item.service && item.service !== "finch") {
    return null;
  }

  const matchedIcon =
    integrationIcons.find((iconItem) => iconItem.slug === item.slug)?.icon ??
    "";

  return {
    companyId,
    code: options?.code ?? undefined,
    integration: (options?.integration ?? undefined) as
      I_IntegrationType | undefined,
    isLive: false,
    status: "Inactive",
    integration_id: item.id,
    settings_instance: false,
    service_name: item.name,
    service_description: item.description ?? "",
    slug: item.slug,
    icon: matchedIcon,
    returnTo: "employees",
  };
}
