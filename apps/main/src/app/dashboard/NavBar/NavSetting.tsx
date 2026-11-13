"use client";

import { useAppDispatch } from "@/store";
import { cn } from "@/lib/utils";
import { clearClientAuthSession } from "@/utils/auth/clearClientAuthSession";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useDashboardPermissions } from "@/hooks/useDashboardPermissions";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { resolveDefaultDashboardRoute } from "@/utils/auth/resolveAccessContext";
import {
  AccountMenuPanel,
  adminAccountMenuItems,
  buildEmployeeAccountMenuItems,
  filterAccountMenuItems,
} from "./AccountMenuPanel";

interface Props {
  className?: string;
  isEmployee?: boolean;
}

const NavSetting: React.FC<Props> = ({ className, isEmployee }) => {
  const dispatch = useAppDispatch();
  const { isPending } = useTransitionRouter();
  const {
    enabled: accountManagementEnabled,
    resolved: accountManagementResolved,
  } = useFeatureFlag(FEATURE_FLAGS.ACCOUNT_MANAGEMENT);
  const permissions = useDashboardPermissions();
  const { access } = useActiveWorkspace();

  const logout = () => {
    clearClientAuthSession(dispatch);
  };

  const items = (() => {
    if (!isEmployee) {
      return filterAccountMenuItems(
        adminAccountMenuItems,
        accountManagementResolved && accountManagementEnabled,
        permissions,
      );
    }

    return buildEmployeeAccountMenuItems(
      access.canAccessDashboard,
      resolveDefaultDashboardRoute(access),
    );
  })();

  return (
    <div className={cn("w-auto", className)}>
      <div className="hidden lg:block">
        <AccountMenuPanel
          items={items}
          onSignOut={logout}
          isPending={isPending}
          triggerTestId="navsetting-button"
          showWorkspaceSwitcher={!isEmployee}
        />
      </div>
      <div className="lg:hidden">
        <AccountMenuPanel
          items={items}
          onSignOut={logout}
          isPending={isPending}
          triggerTestId="navsetting-button-mobile"
          compactTrigger
          showWorkspaceSwitcher={!isEmployee}
        />
      </div>
    </div>
  );
};

export default NavSetting;
