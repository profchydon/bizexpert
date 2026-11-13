"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import CartOverview from "@/components/Drawers/CartOverview";
import { useLegacyCartOverview } from "@/hooks/useCartOverviewVariant";
import { onCartOverviewOpen } from "@/hooks/cartEvents";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";
import routes from "@/routes";
import { useAppDispatch } from "@/store";
import { setSelectedEmployees } from "@/store/slices/employeeSlice";
import { clearDeviceRefreshFlowState } from "@/store/slices/equipEmployeeSlice";
import { useCatalogPolicyCart } from "@/container/Employee/CatalogPolicies/CatalogPolicyCartContext";
import CatalogPolicyCartDrawer from "@/container/Employee/CatalogPolicies/CatalogPolicyCartDrawer";
import { useAuthUserDetail } from "@/utils/useAuthUser";
import { NavBarLead } from "./NavBarLead";
import { NavBarMobileMenu } from "./NavBarMobileMenu";
import NavCartControl from "./NavCartControl";
import NavChangelogButton from "./NavChangelogButton";
// import NavPortalSwitcher from "./NavPortalSwitcher";
import NavSearchButton from "./NavSearchButton";
import NavSetting from "./NavSetting";
import MarketplaceCartOverview from "./MarketplaceCartOverview";
import { navBarActionButtonClass } from "./navBarActionButtonClass";
import { useCartDomainIsolation } from "./useCartDomainIsolation";
import { useDashboardNavItems } from "./useDashboardNavItems";
import { isBizExpertApp } from "@/config/product";
import { BizExpertNavAccount } from "@/components/bizexpert/BizExpertNavAccount";

interface Props {
  isEmployeeNav?: boolean;
  hideNavItems?: boolean;
}

const NavBar: React.FC<Props> = ({
  isEmployeeNav = false,
  hideNavItems = false,
}) => {
  const { access, activeEntityId } = useActiveWorkspace();
  const { push: transitionPush, isPending: isCartNavigatePending } =
    useTransitionRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useCartDomainIsolation();
  const { getUserDetails } = useAuthUserDetail();
  const user = getUserDetails();
  const isBasicCartUser =
    user?.role === "Basic" && (isEmployeeNav || access.isMemberOnly);
  const navBar = useDashboardNavItems();
  const useLegacyCart = useLegacyCartOverview();
  const isEmployeeCatalogPolicyPath = pathname.startsWith(
    routes.EMPLOYEE_CATALOG_POLICIES,
  );

  const [isCartOverviewOpen, setIsCartOverviewOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    cartDisabled: isPolicyCartDisabled,
    isCartOpen: isPolicyCartOpen,
    setCartOpen: setIsPolicyCartOpen,
    totalItems: policyCartItems,
  } = useCatalogPolicyCart();

  React.useEffect(
    () => onCartOverviewOpen(() => setIsCartOverviewOpen(true)),
    [],
  );

  const openCartOverview = () => {
    if (isEmployeeNav && isEmployeeCatalogPolicyPath) {
      setIsPolicyCartOpen(true);
      return;
    }

    setIsCartOverviewOpen(true);
  };

  return (
    <nav className="fixed top-0 z-[102] h-[72px] w-full bg-gray-950">
      <div className="relative h-full page-px">
        <div
          className={
            isBizExpertApp()
              ? "relative flex h-full w-full min-w-0 items-center"
              : "flex h-full w-full min-w-0 items-center justify-between gap-3"
          }
        >
          <NavBarLead isEmployeeNav={isEmployeeNav} />

          {!hideNavItems && (
            <div
              className={
                isBizExpertApp()
                  ? "z-10 ml-auto flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4"
                  : "flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-4"
              }
            >
              {!isEmployeeNav && !isBizExpertApp() && (
                <div className="hidden items-center gap-1 lg:flex">
                  <NavSearchButton />
                  <NavChangelogButton />
                </div>
              )}

              <div className="flex items-center">
                {!isBizExpertApp() && (
                  <NavCartControl
                    disabled={
                      isEmployeeNav &&
                      isEmployeeCatalogPolicyPath &&
                      isPolicyCartDisabled
                    }
                    isBasicUser={isBasicCartUser}
                    externalCartCount={
                      isEmployeeNav && isEmployeeCatalogPolicyPath
                        ? policyCartItems
                        : undefined
                    }
                    onOpenCartOverview={openCartOverview}
                  />
                )}
              </div>

              {isBizExpertApp() ? (
                <BizExpertNavAccount />
              ) : (
                <NavSetting isEmployee={isEmployeeNav} />
              )}

              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                className={`${navBarActionButtonClass} lg:hidden`}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <NavBarMobileMenu
          isOpen={isMenuOpen}
          navItems={navBar}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>

      {useLegacyCart ? (
        <CartOverview
          isOpen={isCartOverviewOpen}
          onClose={() => setIsCartOverviewOpen(false)}
          onSave={() => {
            transitionPush(
              appendEntityWorkspaceParam(
                routes.EQUIP_EMPLOYEE_EMPLOYEES,
                activeEntityId,
              ),
            );
            dispatch(setSelectedEmployees([]));
            setIsCartOverviewOpen(false);
          }}
        />
      ) : (
        <MarketplaceCartOverview
          isOpen={isCartOverviewOpen}
          onClose={() => setIsCartOverviewOpen(false)}
          isProceedLoading={isCartNavigatePending}
          onProceed={() => {
            dispatch(clearDeviceRefreshFlowState());
            transitionPush(
              appendEntityWorkspaceParam(
                routes.EQUIP_EMPLOYEE_EMPLOYEES,
                activeEntityId,
              ),
            );
            dispatch(setSelectedEmployees([]));
          }}
        />
      )}
      <CatalogPolicyCartDrawer
        isOpen={isPolicyCartOpen}
        onClose={() => setIsPolicyCartOpen(false)}
      />
    </nav>
  );
};

export default NavBar;
