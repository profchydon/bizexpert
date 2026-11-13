import type { EntityCountryRef } from "./types";

export function mapEntityCountryLabel(
  country: string | EntityCountryRef | null | undefined,
): string {
  if (!country) return "";
  if (typeof country === "string") return country;
  return country.name?.trim() || country.code?.trim() || "";
}
