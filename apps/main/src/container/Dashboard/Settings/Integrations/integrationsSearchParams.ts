import {
  INTEGRATION_CATEGORY_IDS,
  isHiddenIntegrationCategoryId,
  isIntegrationCategoryId,
  type IntegrationCategoryId,
} from "./integrationCategories";

export type IntegrationView = "all" | "live";

const DEFAULT_CATEGORY: IntegrationCategoryId = "hris";
const DEFAULT_VIEW: IntegrationView = "all";

export function parseIntegrationCategory(
  value: string | null,
): IntegrationCategoryId {
  if (isHiddenIntegrationCategoryId(value)) {
    return DEFAULT_CATEGORY;
  }
  return isIntegrationCategoryId(value) ? value : DEFAULT_CATEGORY;
}

export function parseIntegrationView(value: string | null): IntegrationView {
  return value === "live" ? "live" : DEFAULT_VIEW;
}

export function buildIntegrationsSettingsPath(input: {
  category: IntegrationCategoryId;
  view: IntegrationView;
  extra?: Record<string, string | null | undefined>;
}): string {
  const params = new URLSearchParams();
  params.set("settingsType", "integrations");
  params.set("category", input.category);
  params.set("integrationView", input.view);

  for (const [key, value] of Object.entries(input.extra ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  return `/dashboard/settings?${params.toString()}`;
}

export function identityTabSlugs(): string[] {
  return [
    "google-workspace",
    "microsoft-entra-id",
    "apple-business-manager",
    "microsoft-intune",
  ];
}

export function isDualPurposeIntegration(
  categories: string[] | undefined,
): boolean {
  const set = new Set(categories ?? []);
  return set.has("ticketing") && set.has("knowledge");
}

export { INTEGRATION_CATEGORY_IDS };
