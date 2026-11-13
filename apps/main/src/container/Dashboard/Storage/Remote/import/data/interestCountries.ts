import type { FC, SVGProps } from "react";
import * as CountryFlags from "@untitledui/country-flags";

export interface InterestCountry {
  code: string;
  label: string;
  flag: FC<SVGProps<SVGSVGElement>>;
}

// Countries already served by Open Fleet — excluded from the interest list.
const SUPPORTED = new Set(["NG", "US", "GB", "DE", "KE", "IN"]);
const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const flags = CountryFlags as unknown as Record<
  string,
  FC<SVGProps<SVGSVGElement>>
>;

// Derive the full country list from the flag set (e.g. "FlagNg" → "NG" → "Nigeria"),
// drop the supported regions and any codes without a country name, sort A–Z.
export const INTEREST_COUNTRIES: InterestCountry[] = Object.keys(flags)
  .filter((k) => /^Flag[A-Z][a-z]$/.test(k))
  .map((k) => {
    const code = k.slice(4).toUpperCase();
    let label = code;
    try {
      label = regionNames.of(code) ?? code;
    } catch {
      label = code;
    }
    return { code, label, flag: flags[k] };
  })
  .filter((c) => !SUPPORTED.has(c.code) && c.label !== c.code)
  .sort((a, b) => a.label.localeCompare(b.label));
