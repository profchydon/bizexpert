export const INTEGRATION_CATEGORY_IDS = [
  "hris",
  "ticketing",
  "knowledge",
  "support",
  "identity",
] as const;

export type IntegrationCategoryId = (typeof INTEGRATION_CATEGORY_IDS)[number];

export const HIDDEN_INTEGRATION_CATEGORY_IDS = [
  "ticketing",
  "knowledge",
  "support",
] as const satisfies readonly IntegrationCategoryId[];

const INTEGRATION_CATEGORY_META: {
  id: IntegrationCategoryId;
  label: string;
  badge: string;
}[] = [
  { id: "hris", label: "HRIS", badge: "HRIS" },
  { id: "ticketing", label: "Ticketing", badge: "Ticketing" },
  { id: "knowledge", label: "Knowledge Base", badge: "Knowledge base" },
  { id: "support", label: "Support", badge: "Support" },
  { id: "identity", label: "Identity & devices", badge: "Identity" },
];

export const INTEGRATION_CATEGORY_TABS = INTEGRATION_CATEGORY_META.filter(
  (tab) =>
    !(HIDDEN_INTEGRATION_CATEGORY_IDS as readonly string[]).includes(tab.id),
);

export function isHiddenIntegrationCategoryId(
  value: string | null,
): value is IntegrationCategoryId {
  return (
    value !== null &&
    (HIDDEN_INTEGRATION_CATEGORY_IDS as readonly string[]).includes(value)
  );
}

export function isIntegrationCategoryId(
  value: string | null,
): value is IntegrationCategoryId {
  return INTEGRATION_CATEGORY_IDS.includes(value as IntegrationCategoryId);
}

export function integrationBelongsToCategory(
  categories: string[] | undefined,
  category: IntegrationCategoryId,
): boolean {
  return (categories ?? []).includes(category);
}

export function categoryBadgesFor(categories: string[] | undefined): string[] {
  return INTEGRATION_CATEGORY_META.filter((tab) =>
    integrationBelongsToCategory(categories, tab.id),
  ).map((tab) => tab.badge);
}
