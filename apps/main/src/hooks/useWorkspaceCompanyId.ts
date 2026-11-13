"use client";

import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveWorkspaceApiCompanyId } from "@/utils/workspace/workspaceApiCompanyId";

export function useWorkspaceCompanyId(): string | undefined {
  const { getCompanyDetails } = useAuthUserDetail();
  const { activeEntityId } = useActiveWorkspace();
  return resolveWorkspaceApiCompanyId(getCompanyDetails()?.id, activeEntityId);
}
