import type { EntityMembership } from "@/types/entityMembership";

export function isPrimaryWorkspace(
  memberships: Pick<EntityMembership, "id" | "is_primary">[],
  activeEntityId: string | null,
): boolean {
  if (!activeEntityId) {
    return true;
  }

  return memberships.some(
    (membership) => membership.id === activeEntityId && membership.is_primary,
  );
}
