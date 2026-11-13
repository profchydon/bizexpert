import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import type { ICompany } from "@/types/auth";
import type { EntityMembership } from "@/types/entityMembership";
import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import {
  isEntityAdministratorMembership,
  isOfficeAdministratorMembership,
} from "@/utils/auth/resolveAccessContext";
import {
  GLOBAL_WORKSPACE_ID,
  filterEntitiesForWorkspaceSwitcher,
  findPrimaryWorkspaceEntity,
} from "@/utils/workspace/activeWorkspace";
import { membershipToEntityRecord } from "@/utils/workspace/membershipEntities";
import { UNRESOLVED_WORKSPACE_LABEL } from "@/utils/workspace/unresolvedWorkspaceLabel";
import { resolveEntityCountryCode } from "./resolveEntityCountryCode";

export {
  GLOBAL_WORKSPACE_ID,
  WORKSPACE_SCOPE_STORAGE_KEY,
} from "@/utils/workspace/activeWorkspace";
export { resolveActiveWorkspaceId } from "@/utils/workspace/activeWorkspace";

export const MISSING_SWITCHER_ENTITY_LABEL = "Entity";

export type SwitcherScopeKind = "global" | "subsidiary";

export interface SwitcherScope {
  id: string;
  label: string;
  kind: SwitcherScopeKind;
  countryCode?: string;
  active: boolean;
}

function mapEntityScope(
  entity: EntityApiRecord,
  activeScopeId: string,
): SwitcherScope {
  return {
    id: entity.id,
    label: entity.name,
    kind: "subsidiary",
    countryCode: resolveEntityCountryCode(entity.country),
    active: activeScopeId === entity.id,
  };
}

function membershipAsEntityRecord(
  membership: EntityMembership,
): EntityApiRecord {
  return membershipToEntityRecord(membership);
}

export function mergeSwitcherEntitySources({
  entities,
  memberships,
  access,
  activeScopeId,
}: {
  entities: EntityApiRecord[];
  memberships: EntityMembership[];
  access: AccessContext;
  activeScopeId: string;
}): EntityApiRecord[] {
  const merged = new Map(entities.map((entity) => [entity.id, entity]));

  const membershipCandidates = access.isGlobalAdmin
    ? memberships
    : memberships.filter(
        (membership) =>
          isEntityAdministratorMembership(membership) ||
          isOfficeAdministratorMembership(membership),
      );

  for (const membership of membershipCandidates) {
    if (!merged.has(membership.id)) {
      merged.set(membership.id, membershipAsEntityRecord(membership));
    }
  }

  if (activeScopeId !== GLOBAL_WORKSPACE_ID && !merged.has(activeScopeId)) {
    const activeMembership = memberships.find(
      (membership) => membership.id === activeScopeId,
    );
    merged.set(
      activeScopeId,
      membershipAsEntityRecord(
        activeMembership ?? {
          id: activeScopeId,
          name: UNRESOLVED_WORKSPACE_LABEL,
          is_primary: false,
          country: "",
          parent_company_id: null,
          role: "",
          scope: "entity",
          office_ids: [],
          via_global_admin: false,
        },
      ),
    );
  }

  return Array.from(merged.values());
}

export function resolveSwitcherActiveScope(
  scopes: SwitcherScope[],
  activeScopeId: string,
  company: ICompany | null | undefined,
): SwitcherScope {
  const matchedScope = scopes.find((scope) => scope.id === activeScopeId);
  if (matchedScope) {
    return { ...matchedScope, active: true };
  }

  if (activeScopeId === GLOBAL_WORKSPACE_ID) {
    const globalScope = scopes.find((scope) => scope.kind === "global");
    if (globalScope) {
      return { ...globalScope, active: true };
    }
  }

  return (
    scopes.find((scope) => scope.active) ??
    scopes[0] ?? {
      id: GLOBAL_WORKSPACE_ID,
      label: company?.name ?? "Account",
      kind: "global",
      countryCode: company?.country?.code,
      active: true,
    }
  );
}

export function buildSwitcherScopes({
  company,
  entities,
  access,
  activeScopeId,
}: {
  company: ICompany | null | undefined;
  entities: EntityApiRecord[];
  access: AccessContext;
  activeScopeId: string;
}): SwitcherScope[] {
  const switchableEntities = filterEntitiesForWorkspaceSwitcher(
    entities,
    access,
  );

  if (!access.isGlobalAdmin || !company) {
    return switchableEntities.map((entity) =>
      mapEntityScope(entity, activeScopeId),
    );
  }

  const primaryEntity = findPrimaryWorkspaceEntity(entities);
  const globalScope: SwitcherScope = {
    id: GLOBAL_WORKSPACE_ID,
    label: primaryEntity?.name ?? company.name,
    kind: "global",
    countryCode: primaryEntity
      ? resolveEntityCountryCode(primaryEntity.country)
      : company.country?.code?.toUpperCase(),
    active: activeScopeId === GLOBAL_WORKSPACE_ID,
  };

  return [
    globalScope,
    ...switchableEntities.map((entity) =>
      mapEntityScope(entity, activeScopeId),
    ),
  ];
}
