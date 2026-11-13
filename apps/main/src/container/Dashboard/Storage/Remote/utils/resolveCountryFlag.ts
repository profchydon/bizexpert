import type { FC } from "react";
import { Country } from "country-state-city";
import { flagByCode } from "@/app/dashboard/NavBar/flagByCode";

const NAME_ALIASES: Record<string, string> = {
  uk: "GB",
  usa: "US",
  "united states of america": "US",
};

let nameToCode: Map<string, string> | undefined;

function countryNameToCode(): Map<string, string> {
  if (!nameToCode) {
    nameToCode = new Map(
      Country.getAllCountries().map((country) => [
        country.name.toLowerCase(),
        country.isoCode,
      ]),
    );
  }
  return nameToCode;
}

function normalizeIso2(value?: string | null): string | undefined {
  const code = value?.trim();
  return code?.length === 2 ? code.toUpperCase() : undefined;
}

function codeFromName(value?: string | null): string | undefined {
  const key = value?.trim().toLowerCase();
  if (!key) return undefined;
  return NAME_ALIASES[key] ?? countryNameToCode().get(key);
}

export function resolveCountryCode(
  countryCode?: string | null,
  countryName?: string | null,
): string | undefined {
  return (
    normalizeIso2(countryCode) ??
    codeFromName(countryName) ??
    codeFromName(countryCode)
  );
}

export function resolveCountryFlag(
  countryCode?: string | null,
  countryName?: string | null,
): {
  Flag?: FC<{ className?: string }>;
  initials: string;
} {
  const candidates = [
    normalizeIso2(countryCode),
    codeFromName(countryName),
    codeFromName(countryCode),
  ].filter((code): code is string => Boolean(code));

  for (const code of candidates) {
    const Flag = flagByCode(code);
    if (Flag) return { Flag, initials: code };
  }

  const fallback = candidates[0] ?? countryName?.trim() ?? "?";
  return { initials: fallback.slice(0, 2).toUpperCase() };
}
