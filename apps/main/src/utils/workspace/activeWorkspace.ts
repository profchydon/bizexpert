import type { EntityApiRecord } from "@/api/baseQueries/companiesApi/entitiesApi/types";
import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import {
  isEntityAdministratorMembership,
  isOfficeAdministratorMembership,
} from "@/utils/auth/resolveAccessContext";
import routes from "@/routes";
import {
  filterSwitcherEntities,
  findPrimaryWorkspaceEntity,
} from "@/app/dashboard/NavBar/filterSwitcherEntities";
import { showImmediateWorkspaceSwitchOverlay } from "@/utils/workspace/workspaceSwitchOverlay";

export const GLOBAL_WORKSPACE_ID = "global";
export const WORKSPACE_SCOPE_STORAGE_KEY = "dashboard_workspace_scope";
export const WORKSPACE_SWITCH_LOADING_KEY =
  "dashboard_workspace_switch_loading";

export interface ActiveWorkspaceResolutionInput {
  entityFromUrl: string | null;
  storedScopeId: string | null;
  access: AccessContext;
}

export function readStoredWorkspaceScope(): string | null {
  if (globalThis.window === undefined) return null;
  return globalThis.window.sessionStorage.getItem(WORKSPACE_SCOPE_STORAGE_KEY);
}

export function writeStoredWorkspaceScope(scopeId: string | null) {
  if (globalThis.window === undefined) return;
  if (!scopeId) {
    globalThis.window.sessionStorage.removeItem(WORKSPACE_SCOPE_STORAGE_KEY);
    return;
  }
  globalThis.window.sessionStorage.setItem(
    WORKSPACE_SCOPE_STORAGE_KEY,
    scopeId,
  );
}

export function getAdministeredEntityIds(access: AccessContext): string[] {
  const officeEntityIds = access.memberships
    .filter(isOfficeAdministratorMembership)
    .map((membership) => membership.id);

  return [...new Set([...access.entityAdminEntityIds, ...officeEntityIds])];
}

function isAllowedWorkspaceScopeId(
  scopeId: string,
  access: AccessContext,
  administeredEntityIds: string[],
): boolean {
  if (scopeId === GLOBAL_WORKSPACE_ID) {
    return access.isGlobalAdmin;
  }

  const membershipIds = access.memberships.map((membership) => membership.id);
  const knownIds = new Set([...administeredEntityIds, ...membershipIds]);
  if (knownIds.has(scopeId)) return true;
  if (access.isGlobalAdmin) return false;
  return administeredEntityIds.length === 0 && membershipIds.length === 0;
}

export function resolveActiveWorkspaceId({
  entityFromUrl,
  storedScopeId,
  access,
}: ActiveWorkspaceResolutionInput): string {
  const administeredEntityIds = getAdministeredEntityIds(access);
  const urlId = entityFromUrl?.trim() || null;
  const storedId = storedScopeId?.trim() || null;

  if (
    urlId &&
    isAllowedWorkspaceScopeId(urlId, access, administeredEntityIds)
  ) {
    return urlId;
  }

  if (
    storedId &&
    isAllowedWorkspaceScopeId(storedId, access, administeredEntityIds)
  ) {
    return storedId;
  }

  if (access.isGlobalAdmin) {
    return GLOBAL_WORKSPACE_ID;
  }

  if (access.defaultDashboardEntityId) {
    return access.defaultDashboardEntityId;
  }

  if (administeredEntityIds[0]) {
    return administeredEntityIds[0];
  }

  return GLOBAL_WORKSPACE_ID;
}

export function filterEntitiesForWorkspaceSwitcher(
  entities: EntityApiRecord[],
  access: AccessContext,
): EntityApiRecord[] {
  const switchableEntities = filterSwitcherEntities(entities, {
    excludePrimary: access.isGlobalAdmin,
  });

  if (access.isGlobalAdmin) {
    return switchableEntities;
  }

  const administeredEntityIds = new Set(getAdministeredEntityIds(access));
  if (administeredEntityIds.size === 0) {
    return switchableEntities;
  }

  return switchableEntities.filter((entity) =>
    administeredEntityIds.has(entity.id),
  );
}

export function buildWorkspaceOverviewPath(scopeId: string): string {
  if (scopeId === GLOBAL_WORKSPACE_ID) {
    return routes.OVERVIEW;
  }

  return `${routes.OVERVIEW}?entity=${encodeURIComponent(scopeId)}`;
}

export function markWorkspaceSwitchLoading(scopeId: string) {
  if (globalThis.window === undefined) return;
  globalThis.window.sessionStorage.setItem(
    WORKSPACE_SWITCH_LOADING_KEY,
    scopeId,
  );
}

export function readWorkspaceSwitchLoading(): string | null {
  if (globalThis.window === undefined) return null;
  return globalThis.window.sessionStorage.getItem(WORKSPACE_SWITCH_LOADING_KEY);
}

export function clearWorkspaceSwitchLoading() {
  if (globalThis.window === undefined) return;
  globalThis.window.sessionStorage.removeItem(WORKSPACE_SWITCH_LOADING_KEY);
}

export function navigateToWorkspaceScope(scopeId: string) {
  if (globalThis.window === undefined) return;
  writeStoredWorkspaceScope(scopeId === GLOBAL_WORKSPACE_ID ? null : scopeId);
  markWorkspaceSwitchLoading(scopeId);
  showImmediateWorkspaceSwitchOverlay();
  globalThis.window.location.assign(buildWorkspaceOverviewPath(scopeId));
}

export function appendEntityWorkspaceParam(
  path: string,
  activeEntityId: string | null,
): string {
  if (!activeEntityId) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}entity=${encodeURIComponent(activeEntityId)}`;
}

export { findPrimaryWorkspaceEntity };
