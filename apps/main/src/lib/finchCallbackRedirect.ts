export const FINCH_CALLBACK_REDIRECT_STATUS = 302;

export function isFinchOAuthCallback(input: {
  pathname: string;
  settingsType: string | null;
  integration: string | null;
  service?: string | null;
  code: string | null;
}): boolean {
  const finchReturn =
    input.service === "finch" || input.integration === "finch";
  return (
    input.pathname === "/dashboard/settings" &&
    input.settingsType === "integrations" &&
    finchReturn &&
    Boolean(input.code)
  );
}

export function shouldRestoreFinchCallback(input: {
  pathname: string;
  destinationPath: string;
  urlEntity?: string | null;
  entity?: string | null;
}): boolean {
  const needsPathChange = input.pathname !== input.destinationPath;
  const needsEntity = Boolean(input.entity) && input.urlEntity !== input.entity;
  return needsPathChange || needsEntity;
}

export function isFinchEmployeesCallback(input: {
  pathname: string;
  code: string | null;
  service: string | null;
  integration: string | null;
}): boolean {
  if (input.pathname !== "/dashboard/employees" || !input.code) {
    return false;
  }

  return input.service === "finch" || input.integration === "finch";
}

export function finchCallbackDestinationPath(
  returnToCookie?: string,
): "/dashboard/employees" | "/dashboard/settings" {
  return returnToCookie === "employees"
    ? "/dashboard/employees"
    : "/dashboard/settings";
}

export function resolveFinchCallbackEntity(input: {
  urlEntity?: string | null;
  cookieEntity?: string | null;
}): string | null {
  const urlEntity = input.urlEntity?.trim();
  if (urlEntity) {
    return urlEntity;
  }

  const cookieEntity = input.cookieEntity?.trim();
  return cookieEntity || null;
}

export function buildFinchCallbackSearchParams(input: {
  code: string;
  returnToEmployees: boolean;
  integration?: string | null;
  integrationId?: string | null;
  entity?: string | null;
}): URLSearchParams {
  const params = new URLSearchParams();

  if (input.returnToEmployees) {
    params.set("tab", "hris");
    params.set("service", "finch");
    params.set("code", input.code);
    params.set("integration", input.integration || "finch");
    if (input.integrationId) {
      params.set("integration_id", input.integrationId);
    }
  } else {
    params.set("settingsType", "integrations");
    params.set("service", "finch");
    params.set("code", input.code);
  }

  if (input.entity) {
    params.set("entity", input.entity);
  }

  return params;
}
