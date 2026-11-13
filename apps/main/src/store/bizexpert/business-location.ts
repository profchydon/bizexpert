import type { Location } from "@/types/bizexpert";

export function resolveLocationId(
  locations: Location[],
  storedLocationId: string | null,
): string | null {
  if (!locations.length) return null;
  if (storedLocationId && locations.some((l) => l.id === storedLocationId)) {
    return storedLocationId;
  }
  const def = locations.find((l) => l.isDefault) ?? locations[0];
  return def.id;
}
