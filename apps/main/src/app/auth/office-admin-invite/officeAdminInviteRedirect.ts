import routes from "@/routes";

type SearchValue = string | string[] | undefined;

export function officeAdminInviteDestinationFromSearch(
  searchParams: Record<string, SearchValue>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry) query.append(key, entry);
      }
      continue;
    }

    if (value) {
      query.set(key, value);
    }
  }

  const search = query.toString();
  return search
    ? `${routes.ENTITY_ADMIN_INVITE}?${search}`
    : routes.ENTITY_ADMIN_INVITE;
}
