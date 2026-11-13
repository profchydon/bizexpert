const ENTITY_PARAM = "entity";

export function sanitizePostLoginRedirect(
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return null;

  const queryIndex = trimmed.indexOf("?");
  const pathname = queryIndex === -1 ? trimmed : trimmed.slice(0, queryIndex);
  const params = new URLSearchParams(
    queryIndex === -1 ? "" : trimmed.slice(queryIndex + 1),
  );
  params.delete(ENTITY_PARAM);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
