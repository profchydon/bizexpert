"use client";

import { useMemo } from "react";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { resolveWorkspaceApiCompanyId } from "@/utils/workspace/workspaceApiCompanyId";

export function useWorkspaceScopedCompanyArgs() {
  const { getCompanyDetails } = useAuthUserDetail();
  const { activeEntityId } = useActiveWorkspace();
  const company = getCompanyDetails();

  return useMemo(
    () => ({
      companyId: resolveWorkspaceApiCompanyId(company?.id, activeEntityId),
    }),
    [activeEntityId, company?.id],
  );
}
