export function authorizationHeader(
  token: string | null | undefined,
  skipAuth = false,
): Record<string, string> {
  const trimmed = token?.trim();

  if (skipAuth || !trimmed) {
    return {};
  }

  return { Authorization: `Bearer ${trimmed}` };
}
