import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  INTEGRATION_ENTITY_COOKIE,
  INTEGRATION_RETURN_TO_COOKIE,
} from "./utils/auth/integrationConnectCookies";
import {
  FINCH_CALLBACK_REDIRECT_STATUS,
  buildFinchCallbackSearchParams,
  finchCallbackDestinationPath,
  isFinchEmployeesCallback,
  isFinchOAuthCallback,
  resolveFinchCallbackEntity,
  shouldRestoreFinchCallback,
} from "./lib/finchCallbackRedirect";

const clearIntegrationCookies = (response: NextResponse) => {
  response.cookies.set(INTEGRATION_RETURN_TO_COOKIE, "", {
    maxAge: 0,
    path: "/",
  });
  response.cookies.set(INTEGRATION_ENTITY_COOKIE, "", {
    maxAge: 0,
    path: "/",
  });
};

export const getEquipEmployeeRedirect = (request: NextRequest) => {
  if (request.nextUrl.pathname !== "/dashboard/equip-employee") {
    return null;
  }

  const destinationUrl = new URL(
    "/dashboard/equip-employee/marketplace",
    request.url,
  );
  return NextResponse.redirect(destinationUrl, 307);
};

export const getMicrosoftEntraRedirect = (request: NextRequest) => {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");

  if (
    url.pathname !== "/dashboard/settings/integration/microsoft-entra-id" ||
    !code
  ) {
    return null;
  }

  const destinationUrl = new URL("/dashboard/settings", request.url);
  destinationUrl.searchParams.set("settingsType", "integrations");
  destinationUrl.searchParams.set("integration", "microsoft-entra-id");
  destinationUrl.searchParams.set("code", code);
  return NextResponse.redirect(destinationUrl, 301);
};

const callbackEntity = (request: NextRequest) =>
  resolveFinchCallbackEntity({
    urlEntity: request.nextUrl.searchParams.get("entity"),
    cookieEntity: request.cookies.get(INTEGRATION_ENTITY_COOKIE)?.value,
  });

export const getFinchRedirect = (request: NextRequest) => {
  const url = request.nextUrl;
  const code = url.searchParams.get("code");
  const returnToCookie = request.cookies.get(
    INTEGRATION_RETURN_TO_COOKIE,
  )?.value;
  const entity = callbackEntity(request);

  if (
    !isFinchOAuthCallback({
      pathname: url.pathname,
      settingsType: url.searchParams.get("settingsType"),
      integration: url.searchParams.get("integration"),
      service: url.searchParams.get("service"),
      code,
    }) ||
    !code
  ) {
    return null;
  }

  const returnToEmployees = returnToCookie === "employees";
  const destinationPath = finchCallbackDestinationPath(returnToCookie);
  if (
    !shouldRestoreFinchCallback({
      pathname: url.pathname,
      destinationPath,
      urlEntity: url.searchParams.get("entity"),
      entity,
    })
  ) {
    return null;
  }

  const destinationUrl = new URL(destinationPath, request.url);
  const params = buildFinchCallbackSearchParams({
    code,
    returnToEmployees,
    integration: url.searchParams.get("integration"),
    integrationId: url.searchParams.get("integration_id"),
    entity,
  });
  destinationUrl.search = params.toString();

  const response = NextResponse.redirect(
    destinationUrl,
    FINCH_CALLBACK_REDIRECT_STATUS,
  );
  clearIntegrationCookies(response);
  return response;
};

export const getFinchEmployeesEntityRedirect = (request: NextRequest) => {
  const url = request.nextUrl;
  if (
    !isFinchEmployeesCallback({
      pathname: url.pathname,
      code: url.searchParams.get("code"),
      service: url.searchParams.get("service"),
      integration: url.searchParams.get("integration"),
    })
  ) {
    return null;
  }

  const entity = callbackEntity(request);
  if (!entity || url.searchParams.get("entity") === entity) {
    return null;
  }

  const destinationUrl = url.clone();
  destinationUrl.searchParams.set("entity", entity);
  const response = NextResponse.redirect(
    destinationUrl,
    FINCH_CALLBACK_REDIRECT_STATUS,
  );
  clearIntegrationCookies(response);
  return response;
};
