"use client";

import { useMemo } from "react";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { resolveDashboardPermissions } from "@/utils/auth/resolveDashboardPermissions";

export function useDashboardPermissions() {
  const { access, activeEntityId } = useActiveWorkspace();

  return useMemo(
    () => resolveDashboardPermissions(access, activeEntityId),
    [access, activeEntityId],
  );
}
