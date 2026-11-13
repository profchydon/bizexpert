import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import type { Subsidiary } from "@/container/Dashboard/Accounts/types";
import { mapBillingStatusBadge } from "@/container/Dashboard/Accounts/utils/subsidiaryStatus";
import type { EntityMembership } from "@/types/entityMembership";
import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import { getAdministeredEntityIds } from "@/utils/workspace/activeWorkspace";

export function membershipToEntityRecord(
  membership: EntityMembership,
): EntityApiRecord {
  return {
    id: membership.id,
    name: membership.name,
    country: membership.country,
    is_primary: membership.is_primary,
    parent_company_id: membership.parent_company_id,
    billing_status_badge: membership.billing_status_badge,
    offices_count: membership.offices_count,
    billing_currency: membership.billing_currency,
  } as EntityApiRecord;
}

export function membershipToSubsidiary(
  membership: EntityMembership,
): Subsidiary {
  const billingCurrency = membership.billing_currency ?? "";

  return {
    id: membership.id,
    name: membership.name,
    region: membership.country,
    currency: billingCurrency,
    admins: [],
    status: mapBillingStatusBadge(
      membership.billing_status_badge ?? "",
      "active",
      membership.billing_status_badge === "card_only",
    ),
    officesCount: membership.offices_count ?? 0,
    creditState: "card-only",
    cardOnFile: false,
    createdDaysAgo: 0,
    createdBy: "",
    isPrimary: membership.is_primary,
    billingMode: "self",
    billingEntityId: membership.id,
    billingEntityName: membership.name,
    billingCurrency,
  };
}

export function filterMembershipsForWorkspaceEntities(
  memberships: EntityMembership[],
  access: AccessContext,
): EntityMembership[] {
  if (access.isGlobalAdmin) {
    return memberships.filter((membership) => !membership.is_primary);
  }

  const administeredEntityIds = new Set(getAdministeredEntityIds(access));
  return memberships.filter((membership) =>
    administeredEntityIds.has(membership.id),
  );
}

export function mapMembershipsToVisibleSubsidiaries(
  memberships: EntityMembership[],
  access: AccessContext,
): Subsidiary[] {
  return filterMembershipsForWorkspaceEntities(memberships, access).map(
    membershipToSubsidiary,
  );
}

export function mapMembershipsToWorkspaceEntities(
  memberships: EntityMembership[],
  access: AccessContext,
): EntityApiRecord[] {
  return filterMembershipsForWorkspaceEntities(memberships, access).map(
    membershipToEntityRecord,
  );
}
