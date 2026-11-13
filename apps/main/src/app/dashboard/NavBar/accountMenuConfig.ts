import type { LucideIcon } from "lucide-react";
import { CreditCard, Home, Receipt, Settings, User } from "lucide-react";
import routes from "@/routes";

export type AccountMenuItem = {
  name: string;
  icon: LucideIcon;
  link: string;
};

export const adminAccountMenuItems: AccountMenuItem[] = [
  { name: "View profile", icon: User, link: routes.EMPLOYEE },
  { name: "Transactions", icon: CreditCard, link: routes.TRANSACTIONS },
  { name: "Invoices", icon: Receipt, link: routes.INVOICES },
  { name: "Settings", icon: Settings, link: routes.SETTINGS },
  { name: "Account management", icon: Home, link: routes.ACCOUNTS },
];

export const filterAccountMenuItems = (
  items: AccountMenuItem[],
  accountManagementEnabled: boolean,
  permissions?: {
    canViewTransactions: boolean;
    canViewSettings: boolean;
    canViewAccountManagementMenu: boolean;
  },
): AccountMenuItem[] => {
  let filtered = items;

  if (!accountManagementEnabled) {
    filtered = filtered.filter((item) => item.link !== routes.ACCOUNTS);
  }

  if (!permissions) return filtered;

  return filtered.filter((item) => {
    if (item.link === routes.TRANSACTIONS || item.link === routes.INVOICES) {
      return permissions.canViewTransactions;
    }
    if (item.link === routes.SETTINGS) {
      return permissions.canViewSettings;
    }
    if (item.link === routes.ACCOUNTS) {
      return permissions.canViewAccountManagementMenu;
    }
    return true;
  });
};

export const employeeAccountMenuItems: AccountMenuItem[] = [
  { name: "Profile", icon: User, link: routes.EMPLOYEE_PROFILE },
];

export function buildEmployeeAccountMenuItems(
  canAccessDashboard: boolean,
  dashboardRoute: string = routes.OVERVIEW,
): AccountMenuItem[] {
  if (!canAccessDashboard) {
    return employeeAccountMenuItems;
  }

  return [
    { name: "Go to admin", icon: Home, link: dashboardRoute },
    { name: "Profile", icon: User, link: routes.EMPLOYEE_PROFILE },
  ];
}

export const adminEmployeeAccountMenuItems =
  buildEmployeeAccountMenuItems(true);

export const accountMenuTriggerClass =
  "h-10 min-w-[7.5rem] gap-2 rounded-lg px-4";

export const accountMenuTriggerBaseClass =
  "inline-flex items-center justify-center bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 outline-none focus-visible:outline-none focus-visible:ring-0 data-[state=open]:ring-0 disabled:cursor-not-allowed disabled:opacity-60";
