export function resolveStorageActionCountryId(
  countries: Array<{ id?: string; name?: string }>,
  countryName: string | undefined,
): string | undefined {
  const name = countryName?.trim().toLowerCase();
  if (!name) return undefined;
  return countries.find(
    (country) => country.name?.trim().toLowerCase() === name,
  )?.id;
}

export function storageActionCountryNameFromItems(
  items: Array<{
    country?: string | { name?: string; label?: string } | null;
    asset?: { country?: string | null };
  }>,
): string | undefined {
  const first = items[0];
  if (!first) return undefined;
  if (typeof first.country === "string" && first.country.trim()) {
    return first.country;
  }
  if (first.country && typeof first.country === "object") {
    const named = first.country.name?.trim() || first.country.label?.trim();
    if (named) return named;
  }
  const assetCountry = first.asset?.country?.trim();
  return assetCountry || undefined;
}
