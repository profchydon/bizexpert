import type { I_Integration, I_LiveIntegrations } from "@/types/integrations";

type Args = {
  openIntegration: string | null;
  companyId?: string | null;
  liveHrisIntegrations: I_LiveIntegrations[];
  integrationsData?: I_Integration[];
};

export type HrisFinchOpenSource =
  | { kind: "manage"; companyId: string; integration: I_LiveIntegrations }
  | { kind: "connect"; companyId: string; integration: I_Integration };

export function selectHrisFinchOpenSource({
  openIntegration,
  companyId,
  liveHrisIntegrations,
  integrationsData,
}: Args): HrisFinchOpenSource | null {
  if (!openIntegration || !companyId) {
    return null;
  }

  const liveIntegration = liveHrisIntegrations.find(
    (item) => item.integration?.slug === openIntegration,
  );
  if (liveIntegration) {
    return { kind: "manage", companyId, integration: liveIntegration };
  }

  const catalogIntegration = (integrationsData ?? []).find(
    (item) => item.slug === openIntegration,
  );
  if (!catalogIntegration) {
    return null;
  }

  return { kind: "connect", companyId, integration: catalogIntegration };
}
