import type { ComponentType } from "react";
import countries from "world-countries";

export interface CountryEntry {
  code: string;
  countryId: string;
  name: string;
  employees: number;
  equipment: number;
  storage: number;
  catalogs: number;
}

export interface TooltipState {
  x: number;
  y: number;
  countryCode: string;
}

export type IconComponent = ComponentType<{ className?: string }>;

const padNumeric = (value: string) => value.padStart(3, "0");

export const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = countries.reduce(
  (mapping, country) => {
    if (!country.cca2 || !country.ccn3) {
      return mapping;
    }

    const numeric = padNumeric(country.ccn3);
    mapping[numeric] = country.cca2;
    mapping[String(Number(numeric))] = country.cca2;
    return mapping;
  },
  {} as Record<string, string>,
);
