import routes from "@/routes";

export const ACCOUNT_MANAGEMENT_ROUTE_PREFIX = routes.ACCOUNTS;

export const resolveRouteWhenAccountManagementDisabled = (): string =>
  routes.OVERVIEW;

export const isAccountManagementPath = (pathname: string): boolean =>
  pathname === ACCOUNT_MANAGEMENT_ROUTE_PREFIX ||
  pathname.startsWith(`${ACCOUNT_MANAGEMENT_ROUTE_PREFIX}/`);
