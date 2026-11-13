import {
  catalogPolicyUpgradeHref,
  isCatalogEntitlementRoute,
} from "@/config/catalogEntitlementRoutes";
import routes from "@/routes";
import type { DashboardNavItemId } from "@/utils/auth/resolveDashboardPermissions";
import { canViewDashboardNavItem } from "@/utils/auth/resolveDashboardPermissions";
import type { DashboardPermissions } from "@/utils/auth/resolveDashboardPermissions";
import { appendEntityWorkspaceParam } from "@/utils/workspace/activeWorkspace";

export interface NavSubItem {
  id: string;
  name: string;
  link: string;
}

export interface NavItem {
  id: string;
  name: string;
  link: string;
  isActive: boolean;
  removeNav?: boolean;
  children?: NavSubItem[];
}

export const items = (
  pathname: string,
  permissions?: DashboardPermissions,
  activeEntityId?: string | null,
  options?: { search?: string; catalogPolicyOn?: boolean },
): NavItem[] => {
  const withEntity = (link: string) =>
    appendEntityWorkspaceParam(link, activeEntityId ?? null);
  const policyLocked = options?.catalogPolicyOn === false;
  const policyBase = isCatalogEntitlementRoute(pathname)
    ? routes.OVERVIEW
    : pathname;
  const catalogPolicyLink = policyLocked
    ? catalogPolicyUpgradeHref(
        policyBase,
        isCatalogEntitlementRoute(pathname) ? "" : (options?.search ?? ""),
        activeEntityId,
      )
    : withEntity(routes.CATALOG_POLICIES);

  const navItems: NavItem[] = [
    {
      id: "overview",
      name: "Overview",
      link: withEntity(routes.OVERVIEW),
      isActive: pathname === routes.OVERVIEW,
    },
    {
      id: "orders",
      name: "Orders",
      link: withEntity(routes.ORDERS),
      isActive: pathname === routes.ORDERS,
    },
    {
      id: "department",
      name: "Departments/Levels",
      link: withEntity(routes.DEPARTMENT),
      isActive: pathname === routes.DEPARTMENT,
    },
    {
      id: "catalogs",
      name: "Catalogs",
      link: withEntity(routes.CATALOGS),
      isActive:
        pathname.startsWith(routes.CATALOGS) ||
        pathname.startsWith(routes.CATALOG_POLICIES) ||
        pathname.startsWith(routes.APPROVALS) ||
        pathname.startsWith(routes.KITS),
      children: [
        {
          id: "kit-library",
          name: "Kit Library",
          link: withEntity(routes.KITS),
        },
        {
          id: "catalog-policies",
          name: "Catalog Policy",
          link: catalogPolicyLink,
        },
        {
          id: "approvals",
          name: "Approvals",
          link: withEntity(routes.APPROVALS),
        },
      ],
    },
    {
      id: "storage",
      name: "Storage",
      link: withEntity(routes.STORAGE),
      isActive: pathname === routes.STORAGE,
    },
    {
      id: "employees",
      name: "Employees",
      link: withEntity(routes.EMPLOYEES),
      isActive: pathname === routes.EMPLOYEES,
    },
    {
      id: "all-equipments",
      name: "Device Fleet",
      link: withEntity(routes.All_Equipments),
      isActive: pathname === routes.All_Equipments,
    },
    {
      id: "fleet-insights",
      name: "Fleet Insights",
      link: withEntity(routes.FLEET_INSIGHTS),
      isActive: pathname === routes.FLEET_INSIGHTS,
      removeNav: true,
    },
    {
      id: "marketplace",
      name: "Marketplace",
      link: withEntity(routes.EQUIP_EMPLOYEE),
      isActive: pathname === routes.EQUIP_EMPLOYEE,
    },
  ];

  if (!permissions) return navItems;

  return navItems.map((item) => ({
    ...item,
    removeNav:
      item.removeNav ||
      !canViewDashboardNavItem(permissions, item.id as DashboardNavItemId),
  }));
};

export const isChildActive = (pathname: string, child: NavSubItem) =>
  pathname === child.link || pathname.startsWith(`${child.link}/`);
