export const INTEGRATION_RETURN_TO_COOKIE = "integration_return_to";
export const INTEGRATION_ENTITY_COOKIE = "integration_entity";

export function integrationCookiePair(name: string, value: string): string {
  return `${name}=${encodeURIComponent(value)}; path=/; max-age=300; samesite=lax`;
}

export function readEntityFromLocationSearch(search: string): string | null {
  const query = search.startsWith("?") ? search.slice(1) : search;
  const entity = new URLSearchParams(query).get("entity")?.trim();
  return entity || null;
}

export function connectWorkspaceEntity(
  search: string,
  storedScopeId?: string | null,
): string | null {
  return readEntityFromLocationSearch(search) || storedScopeId?.trim() || null;
}

export function setIntegrationConnectCookies(input: {
  returnTo?: string;
  entity?: string | null;
}): void {
  if (typeof document === "undefined") {
    return;
  }

  if (input.returnTo) {
    document.cookie = integrationCookiePair(
      INTEGRATION_RETURN_TO_COOKIE,
      input.returnTo,
    );
  }

  if (input.entity) {
    document.cookie = integrationCookiePair(
      INTEGRATION_ENTITY_COOKIE,
      input.entity,
    );
  }
}
