import type { EntityMembership } from "@/types/entityMembership";

type MembershipRef = Pick<
  EntityMembership,
  "id" | "is_primary" | "parent_company_id"
>;

function companyIdFromMembership(
  membership: MembershipRef | undefined,
  fallback?: string | null,
): string | undefined {
  if (!membership) {
    return fallback ?? undefined;
  }

  if (membership.is_primary) {
    return membership.id;
  }

  return membership.parent_company_id ?? fallback ?? undefined;
}

export function resolveEntitiesListCompanyId({
  primaryCompanyId,
  activeEntityId,
  memberships,
}: {
  primaryCompanyId?: string | null;
  activeEntityId?: string | null;
  memberships: MembershipRef[];
}): string | undefined {
  const workspaceCompanyId = activeEntityId ?? primaryCompanyId ?? undefined;
  if (!workspaceCompanyId) {
    return undefined;
  }

  return companyIdFromMembership(
    memberships.find((item) => item.id === workspaceCompanyId),
    primaryCompanyId,
  );
}
