import { getDashboardOverviewRedirectPath } from "@/getDashboardOverviewRedirect";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getEquipEmployeeRedirect,
  getFinchEmployeesEntityRedirect,
  getFinchRedirect,
  getMicrosoftEntraRedirect,
} from "./middlewareIntegrationRedirects";

const getOfficeAdminInviteRedirect = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  if (
    pathname !== "/auth/office-admin-invite" &&
    pathname !== "/auth/office-admin-invite/"
  ) {
    return null;
  }

  const destinationUrl = new URL("/auth/entity-admin-invite", request.url);
  destinationUrl.search = request.nextUrl.search;
  return NextResponse.redirect(destinationUrl, 307);
};

const getDashboardOverviewRedirect = (request: NextRequest) => {
  const destination = getDashboardOverviewRedirectPath(
    request.nextUrl.pathname,
  );
  if (!destination) {
    return null;
  }

  const destinationUrl = new URL(destination, request.url);
  destinationUrl.search = request.nextUrl.search;
  return NextResponse.redirect(destinationUrl, 307);
};

export function middleware(request: NextRequest) {
  const officeAdminInviteRedirect = getOfficeAdminInviteRedirect(request);
  if (officeAdminInviteRedirect) {
    return officeAdminInviteRedirect;
  }

  const dashboardOverviewRedirect = getDashboardOverviewRedirect(request);
  if (dashboardOverviewRedirect) {
    return dashboardOverviewRedirect;
  }

  const equipEmployeeRedirect = getEquipEmployeeRedirect(request);
  if (equipEmployeeRedirect) {
    return equipEmployeeRedirect;
  }

  const microsoftEntraRedirect = getMicrosoftEntraRedirect(request);
  if (microsoftEntraRedirect) {
    return microsoftEntraRedirect;
  }

  const finchRedirect = getFinchRedirect(request);
  if (finchRedirect) {
    return finchRedirect;
  }

  const finchEmployeesRedirect = getFinchEmployeesEntityRedirect(request);
  if (finchEmployeesRedirect) {
    return finchEmployeesRedirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/office-admin-invite",
    "/auth/office-admin-invite/",
    "/dashboard",
    "/dashboard/",
    "/dashboard/equip-employee",
    "/dashboard/settings/integration/microsoft-entra-id",
    "/dashboard/settings",
    "/dashboard/employees",
  ],
};
