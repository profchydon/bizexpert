export function createdNamedResourceId(
  response: { data?: unknown } | null | undefined,
): string | null {
  const data = response?.data;
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }
  if (!data || typeof data !== "object") {
    return null;
  }
  const id = (data as { id?: unknown }).id;
  return typeof id === "string" && id.trim() ? id : null;
}
