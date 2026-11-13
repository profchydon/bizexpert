import routes from "@/routes";

export const ORDER_FLOWS_NEW_ONLY_ROUTES = [
  routes.EMPLOYEES_ONBOARD_DEVICES,
  routes.EMPLOYEES_ONBOARD_SUMMARY,
  routes.EMPLOYEES_OFFBOARD_DEVICES,
  routes.EMPLOYEES_OFFBOARD_SUMMARY,
] as const;

export const resolveLegacyRouteForNewFlow = (pathname: string): string => {
  if (
    pathname.startsWith(routes.EMPLOYEES_ONBOARD_DEVICES) ||
    pathname.startsWith(routes.EMPLOYEES_ONBOARD_SUMMARY)
  ) {
    return routes.EQUIP_EMPLOYEE_MARKETPLACE;
  }

  if (
    pathname.startsWith(routes.EMPLOYEES_OFFBOARD_DEVICES) ||
    pathname.startsWith(routes.EMPLOYEES_OFFBOARD_SUMMARY)
  ) {
    return routes.OFFBOARDING;
  }

  return routes.DASHBOARD;
};
