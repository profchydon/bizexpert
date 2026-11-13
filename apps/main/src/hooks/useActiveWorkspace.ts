"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EntityMembership } from "@/types/entityMembership";
import { useAppDispatch } from "@/store";
import { setWorkspaceScope } from "@/store/slices/workspaceScopeSlice";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveAccessContext } from "@/utils/auth/resolveAccessContext";
import {
  GLOBAL_WORKSPACE_ID,
  readStoredWorkspaceScope,
  resolveActiveWorkspaceId,
  writeStoredWorkspaceScope,
} from "@/utils/workspace/activeWorkspace";

function buildMembershipKey(memberships: EntityMembership[]) {
  return memberships
    .map(
      (membership) =>
        `${membership.id}:${membership.scope}:${membership.role}:${membership.via_global_admin}`,
    )
    .sort()
    .join("|");
}

export function useActiveWorkspace() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { getUserDetails, getEntityMemberships } = useAuthUserDetail();
  const user = getUserDetails();
  const memberships = getEntityMemberships();
  const membershipKey = buildMembershipKey(memberships);
  const access = useMemo(
    () => resolveAccessContext(user, memberships),
    [membershipKey, user],
  );
  const [storedScopeId, setStoredScopeIdState] = useState<string | null>(() =>
    readStoredWorkspaceScope(),
  );

  const entityFromUrl = searchParams.get("entity");
  const activeScopeId = resolveActiveWorkspaceId({
    entityFromUrl,
    storedScopeId,
    access,
  });
  const activeEntityId =
    activeScopeId === GLOBAL_WORKSPACE_ID ? null : activeScopeId;
  const isGlobalWorkspace = activeScopeId === GLOBAL_WORKSPACE_ID;

  const setStoredScopeId = (scopeId: string | null) => {
    writeStoredWorkspaceScope(scopeId);
    setStoredScopeIdState(scopeId);
  };

  useLayoutEffect(() => {
    dispatch(
      setWorkspaceScope({
        activeScopeId,
        activeEntityId,
      }),
    );
  }, [activeEntityId, activeScopeId, dispatch]);

  useEffect(() => {
    if (activeScopeId === GLOBAL_WORKSPACE_ID) {
      if (storedScopeId !== null) {
        writeStoredWorkspaceScope(null);
        setStoredScopeIdState(null);
      }
      return;
    }

    if (storedScopeId !== activeScopeId) {
      writeStoredWorkspaceScope(activeScopeId);
      setStoredScopeIdState(activeScopeId);
    }
  }, [activeScopeId, storedScopeId]);

  return {
    access,
    activeScopeId,
    activeEntityId,
    isGlobalWorkspace,
    entityFromUrl,
    storedScopeId,
    setStoredScopeId,
  };
}
