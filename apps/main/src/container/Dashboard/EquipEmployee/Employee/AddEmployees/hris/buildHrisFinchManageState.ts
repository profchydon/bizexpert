import type { I_Configuration, I_LiveIntegrations } from "@/types/integrations";
import { slug as integrationIcons } from "@/container/Dashboard/Settings/Integrations/integrationImages";
import { isFinchIntegration } from "@/container/Dashboard/Settings/Integrations/liveIntegrationKey";
import type { HrisFinchManageState } from "./hrisFinchManageState";

export function buildHrisFinchManageState(
  integration: I_LiveIntegrations,
  companyId: string,
): HrisFinchManageState | null {
  if (!isFinchIntegration(integration)) {
    return null;
  }

  const matchedIcon =
    integrationIcons.find(
      (iconItem) => iconItem.slug === integration.integration?.slug,
    )?.icon ?? "";

  return {
    companyId,
    isLive: true,
    status: integration.status ?? "Inactive",
    integration_id: String(integration.id),
    domain: integration.domain as string,
    configuration: integration.configuration as I_Configuration,
    settings_instance: true,
    service_name: integration.integration?.name ?? "Integration",
    service_description: integration.integration?.description ?? "",
    slug: integration.integration?.slug ?? "",
    icon: matchedIcon,
    returnTo: "employees",
  };
}
