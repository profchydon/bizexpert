import type { EntityBillingStatusBadge } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import { UNMAPPED_SUBSIDIARY_STATUS, type SubsidiaryStatus } from "../types";

export const ENTITY_BILLING_STATUS_BADGES: EntityBillingStatusBadge[] = [
  "operational",
  "card_pending",
  "card_only",
  "suspended",
  "delegated",
  "closed",
];

export const SUBSIDIARY_STATUSES: SubsidiaryStatus[] = [
  "operational",
  "card-pending",
  "suspended",
  "permanent-card-only",
  "closed",
  "delegated",
  UNMAPPED_SUBSIDIARY_STATUS,
];

export function isSubsidiaryStatus(value: string): value is SubsidiaryStatus {
  return (SUBSIDIARY_STATUSES as string[]).includes(value);
}

export function normalizeEntityLifecycleStatus(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

export function mapBillingStatusBadge(
  badge: string,
  lifecycleStatus: string,
  permanentCardOnly: boolean,
): SubsidiaryStatus {
  if (normalizeEntityLifecycleStatus(lifecycleStatus) === "closed") {
    return "closed";
  }
  if (permanentCardOnly || badge === "card_only") return "permanent-card-only";

  switch (badge) {
    case "card_pending":
      return "card-pending";
    case "suspended":
      return "suspended";
    case "delegated":
      return "delegated";
    case "operational":
      return "operational";
    case "closed":
      return "closed";
    default:
      return UNMAPPED_SUBSIDIARY_STATUS;
  }
}

export function mapSubsidiaryStatusToApiBadge(
  status: SubsidiaryStatus,
): EntityBillingStatusBadge | null {
  if (status === UNMAPPED_SUBSIDIARY_STATUS) return null;

  switch (status) {
    case "operational":
      return "operational";
    case "card-pending":
      return "card_pending";
    case "suspended":
      return "suspended";
    case "permanent-card-only":
      return "card_only";
    case "closed":
      return "closed";
    case "delegated":
      return "delegated";
    default:
      return null;
  }
}

export function mapSubsidiaryStatusesToApiBadges(
  statuses: SubsidiaryStatus[],
): EntityBillingStatusBadge[] {
  return [
    ...new Set(
      statuses
        .map(mapSubsidiaryStatusToApiBadge)
        .filter((badge): badge is EntityBillingStatusBadge => badge !== null),
    ),
  ];
}
