import type { AccessContext } from "@/utils/auth/resolveAccessContext";
import { isPrimaryWorkspace } from "@/utils/workspace/isPrimaryWorkspace";
import routes from "@/routes";

export interface DashboardPermissions {
  canViewOverview: boolean;
  canViewOrders: boolean;
  canViewDepartments: boolean;
  canViewCatalogs: boolean;
  canViewStorage: boolean;
  canViewEmployees: boolean;
  canViewAssetVault: boolean;
  canViewFleetInsights: boolean;
  canViewMarketplace: boolean;
  canViewSettings: boolean;
  canViewTransactions: boolean;
  canViewAccountsIndex: boolean;
  canViewAccountManagementMenu: boolean;
  canCreateEntities: boolean;
  canCreateOffices: boolean;
  entityDetailPath: string | null;
}

const globalPermissions: Omit<DashboardPermissions, "entityDetailPath"> = {
  canViewOverview: true,
  canViewOrders: true,
  canViewDepartments: true,
  canViewCatalogs: true,
  canViewStorage: true,
  canViewEmployees: true,
  canViewAssetVault: true,
  canViewFleetInsights: true,
  canViewMarketplace: true,
  canViewSettings: true,
  canViewTransactions: true,
  canViewAccountsIndex: true,
  canViewAccountManagementMenu: true,
  canCreateEntities: true,
  canCreateOffices: true,
};

const entityAdminPermissions: Omit<DashboardPermissions, "entityDetailPath"> = {
  canViewOverview: true,
  canViewOrders: true,
  canViewDepartments: false,
  canViewCatalogs: true,
  canViewStorage: true,
  canViewEmployees: true,
  canViewAssetVault: true,
  canViewFleetInsights: true,
  canViewMarketplace: true,
  canViewSettings: false,
  canViewTransactions: false,
  canViewAccountsIndex: false,
  canViewAccountManagementMenu: false,
  canCreateEntities: false,
  canCreateOffices: true,
};

const officeAdminPermissions: Omit<DashboardPermissions, "entityDetailPath"> = {
  canViewOverview: true,
  canViewOrders: false,
  canViewDepartments: false,
  canViewCatalogs: false,
  canViewStorage: false,
  canViewEmployees: true,
  canViewAssetVault: true,
  canViewFleetInsights: true,
  canViewMarketplace: false,
  canViewSettings: false,
  canViewTransactions: false,
  canViewAccountsIndex: false,
  canViewAccountManagementMenu: false,
  canCreateEntities: false,
  canCreateOffices: false,
};

export function resolveDashboardPermissions(
  access: AccessContext,
  activeEntityId: string | null,
): DashboardPermissions {
  const entityDetailPath = activeEntityId
    ? routes.SUBSIDIARY_DETAIL(activeEntityId)
    : access.defaultDashboardEntityId
      ? routes.SUBSIDIARY_DETAIL(access.defaultDashboardEntityId)
      : null;

  if (access.isGlobalAdmin) {
    const onPrimaryWorkspace = isPrimaryWorkspace(
      access.memberships,
      activeEntityId,
    );

    return {
      ...globalPermissions,
      canViewAccountsIndex: onPrimaryWorkspace,
      canViewAccountManagementMenu: onPrimaryWorkspace,
      canCreateEntities: onPrimaryWorkspace,
      entityDetailPath,
    };
  }

  if (access.actingRole === "entity") {
    return { ...entityAdminPermissions, entityDetailPath };
  }

  if (access.actingRole === "office") {
    return { ...officeAdminPermissions, entityDetailPath };
  }

  return {
    canViewOverview: false,
    canViewOrders: false,
    canViewDepartments: false,
    canViewCatalogs: false,
    canViewStorage: false,
    canViewEmployees: false,
    canViewAssetVault: false,
    canViewFleetInsights: false,
    canViewMarketplace: false,
    canViewSettings: false,
    canViewTransactions: false,
    canViewAccountsIndex: false,
    canViewAccountManagementMenu: false,
    canCreateEntities: false,
    canCreateOffices: false,
    entityDetailPath,
  };
}

export type DashboardNavItemId =
  | "overview"
  | "orders"
  | "department"
  | "catalogs"
  | "storage"
  | "employees"
  | "all-equipments"
  | "fleet-insights"
  | "marketplace";

export function canViewDashboardNavItem(
  permissions: DashboardPermissions,
  itemId: DashboardNavItemId,
): boolean {
  switch (itemId) {
    case "overview":
      return permissions.canViewOverview;
    case "orders":
      return permissions.canViewOrders;
    case "department":
      return permissions.canViewDepartments;
    case "catalogs":
      return permissions.canViewCatalogs;
    case "storage":
      return permissions.canViewStorage;
    case "employees":
      return permissions.canViewEmployees;
    case "all-equipments":
      return permissions.canViewAssetVault;
    case "fleet-insights":
      return permissions.canViewFleetInsights;
    case "marketplace":
      return permissions.canViewMarketplace;
    default:
      return false;
  }
}
