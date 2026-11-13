import type { ComponentType, HTMLAttributes } from "react";
import {
  FlagAu,
  FlagBr,
  FlagCa,
  FlagCh,
  FlagDe,
  FlagEs,
  FlagFr,
  FlagGb,
  FlagIe,
  FlagIn,
  FlagIt,
  FlagJp,
  FlagMx,
  FlagMy,
  FlagNl,
  FlagPt,
  FlagSe,
  FlagSg,
  FlagUs,
  FlagUy,
} from "@untitledui/country-flags";
import type { Employee } from "../data/dummy-employees";
import { makePhoneFromId } from "./employee-phone";

type FlagComponent = ComponentType<HTMLAttributes<HTMLOrSVGElement>>;

const COUNTRY_FLAGS: Record<string, FlagComponent> = {
  "United States": FlagUs as FlagComponent,
  "United Kingdom": FlagGb as FlagComponent,
  Germany: FlagDe as FlagComponent,
  Canada: FlagCa as FlagComponent,
  Australia: FlagAu as FlagComponent,
  Ireland: FlagIe as FlagComponent,
  France: FlagFr as FlagComponent,
  Spain: FlagEs as FlagComponent,
  Netherlands: FlagNl as FlagComponent,
  Sweden: FlagSe as FlagComponent,
  Portugal: FlagPt as FlagComponent,
  Malaysia: FlagMy as FlagComponent,
  Uruguay: FlagUy as FlagComponent,
  Brazil: FlagBr as FlagComponent,
  India: FlagIn as FlagComponent,
  Japan: FlagJp as FlagComponent,
  Mexico: FlagMx as FlagComponent,
  Singapore: FlagSg as FlagComponent,
  Switzerland: FlagCh as FlagComponent,
  Italy: FlagIt as FlagComponent,
};

const COUNTRY_SHORT: Record<string, string> = {
  "United States": "United States of A...",
  "United Kingdom": "United Kingdom of...",
};

// Representative state/region per country so the Location column reads "State, Country". The employee
// record only stores a country, so this is a stand-in region for the prototype.
const REGION_BY_COUNTRY: Record<string, string> = {
  "United States": "California",
  "United Kingdom": "England",
  Germany: "Berlin",
  Canada: "Ontario",
  Australia: "New South Wales",
  Ireland: "Leinster",
  France: "Île-de-France",
  Spain: "Madrid",
  Netherlands: "North Holland",
  Sweden: "Stockholm",
  Portugal: "Lisbon",
  Malaysia: "Selangor",
  Uruguay: "Montevideo",
  Brazil: "São Paulo",
  India: "Maharashtra",
  Japan: "Tokyo",
  Mexico: "Jalisco",
  Singapore: "Central",
  Switzerland: "Zürich",
  Italy: "Lombardy",
};

export function getCountryFlag(country: string): FlagComponent | undefined {
  return COUNTRY_FLAGS[country];
}

export function getCountryDisplay(country: string): string {
  return COUNTRY_SHORT[country] ?? country;
}

// "State, Country" location label (falls back to just the country when no region is known).
export function getEmployeeLocation(country: string): string {
  const region = REGION_BY_COUNTRY[country];
  return region ? `${region}, ${country}` : country;
}

const LEVEL_RULES: Array<{ test: RegExp; label: string }> = [
  { test: /\b(Director|Head)\b/i, label: "Director" },
  { test: /\bManager\b/i, label: "Manager" },
  { test: /\b(Lead|Leader)\b/i, label: "Team Lead" },
  { test: /\bSpecialist\b/i, label: "Specialist" },
  { test: /\bIntern\b/i, label: "Intern" },
  { test: /\bAnalyst\b/i, label: "Analyst" },
];

const LEVEL_CYCLE = [
  "Manager",
  "Team Lead",
  "Entry-Empl...",
  "Middle Man...",
  "Intern",
];

export function getEmployeeLevel(employee: Employee): string {
  for (const { test, label } of LEVEL_RULES) {
    if (test.test(employee.role)) return label;
  }
  const index = Math.abs(hashId(employee.id)) % LEVEL_CYCLE.length;
  return LEVEL_CYCLE[index];
}

export function getEmployeePhone(employee: Employee): string {
  return employee.phone || makePhoneFromId(employee.id);
}

export function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}
