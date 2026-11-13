import { I_OtherAbmDetails } from "@/types/integrations";

type CatalogIntegrationSource = {
  integration_id?: string;
  integration?: { id?: string };
};

export function resolveCatalogIntegrationId(
  source?: CatalogIntegrationSource | null,
  fallbackCatalogIntegrationId = "",
): string {
  return (
    source?.integration_id ??
    source?.integration?.id ??
    fallbackCatalogIntegrationId
  );
}

export function resolveAbmOrgId(
  otherDetails?: I_OtherAbmDetails | string | null,
): string {
  if (!otherDetails) {
    return "";
  }

  if (typeof otherDetails === "string") {
    try {
      const parsed = JSON.parse(otherDetails) as I_OtherAbmDetails;
      return parsed.orgId ?? "";
    } catch {
      return "";
    }
  }

  return otherDetails.orgId ?? "";
}
