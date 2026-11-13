"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageState from "@/components/PageState";
import { resolveRouteWhenAccountManagementDisabled } from "@/config/accountManagementRoutes";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import {
  GLOBAL_WORKSPACE_ID,
  buildWorkspaceOverviewPath,
} from "@/utils/workspace/activeWorkspace";
import { isPrimaryWorkspace } from "@/utils/workspace/isPrimaryWorkspace";

interface AccountManagementRouteGuardProps {
  children: React.ReactNode;
}

const AccountManagementRouteGuard: React.FC<
  AccountManagementRouteGuardProps
> = ({ children }) => {
  const router = useRouter();
  const { enabled, resolved } = useFeatureFlag(
    FEATURE_FLAGS.ACCOUNT_MANAGEMENT,
  );
  const { access, activeEntityId, activeScopeId } = useActiveWorkspace();
  const allowForWorkspace =
    !access.isGlobalAdmin ||
    isPrimaryWorkspace(access.memberships, activeEntityId);

  useEffect(() => {
    if (!resolved) return;
    if (!enabled) {
      router.replace(resolveRouteWhenAccountManagementDisabled());
      return;
    }
    if (allowForWorkspace) return;
    router.replace(
      buildWorkspaceOverviewPath(activeScopeId || GLOBAL_WORKSPACE_ID),
    );
  }, [activeScopeId, allowForWorkspace, enabled, resolved, router]);

  if (!resolved || !enabled || !allowForWorkspace) {
    return <PageState isLoading isError={false} />;
  }

  return <>{children}</>;
};

export default AccountManagementRouteGuard;
