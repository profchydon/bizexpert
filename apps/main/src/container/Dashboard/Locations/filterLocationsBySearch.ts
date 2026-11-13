import type { Location } from "@/types/bizexpert";

export function filterLocationsBySearch(
  locations: Location[],
  query: string,
): Location[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return locations;
  return locations.filter((location) => {
    const haystack = [location.name, location.type, location.address ?? ""]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}
