export interface CountryOption {
  id: string;
  name: string;
}

export function resolveCountryId(
  sessionCountryId: string | undefined,
  countries: CountryOption[],
  selectedCountryName: unknown,
): string {
  const name =
    typeof selectedCountryName === "string" ? selectedCountryName.trim() : "";

  const match = name
    ? countries.find(
        (country) => country.name?.toLowerCase() === name.toLowerCase(),
      )
    : undefined;

  return match?.id ?? sessionCountryId ?? "";
}
