import type { ComponentType } from "react";
import * as CountryFlags from "@untitledui/country-flags";
import { Globe01 } from "@untitledui/icons";
import { dialCodes } from "./dial-codes";

export interface PhoneCountry {
  dialCode: string;
  icon: ComponentType<{ className?: string }>;
  id: string;
  label: string;
}

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

const labelOverrides: Record<string, string> = {
  cd: "Congo (DRC)",
  cg: "Congo (Republic)",
  ci: "Cote d'Ivoire",
  cv: "Cabo Verde",
  hk: "Hong Kong",
  mo: "Macau",
  ps: "Palestine",
  sz: "Eswatini",
  tl: "Timor-Leste",
  tr: "Türkiye",
  va: "Vatican City",
  xk: "Kosovo",
};

function getFlagIcon(code: string) {
  const key =
    `Flag${code[0].toUpperCase()}${code[1].toLowerCase()}` as keyof typeof CountryFlags;
  return CountryFlags[key] as ComponentType<{ className?: string }> | undefined;
}

export const phoneCountries: PhoneCountry[] = Object.entries(dialCodes)
  .map(([code, dialCode]) => {
    const label =
      labelOverrides[code] ??
      displayNames.of(code.toUpperCase()) ??
      code.toUpperCase();
    return {
      id: code,
      label,
      dialCode: dialCode.split("-")[0],
      icon: getFlagIcon(code) ?? Globe01,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

export const phoneDialCodes = Object.fromEntries(
  phoneCountries.map(({ dialCode, id }) => [id, dialCode]),
);
