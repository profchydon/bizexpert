import routes from "@/routes";

export function getDashboardOverviewRedirectPath(
  pathname: string,
): string | null {
  if (pathname === routes.DASHBOARD || pathname === `${routes.DASHBOARD}/`) {
    return routes.OVERVIEW;
  }

  return null;
}
