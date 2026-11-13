import type { FC, SVGProps } from "react";
import {
  FlagDe,
  FlagGb,
  FlagIn,
  FlagKe,
  FlagNg,
  FlagUs,
} from "@untitledui/country-flags";

export interface SupportedCountry {
  country: string;
  warehouse: string;
  intakeEstimate: string;
  flag: FC<SVGProps<SVGSVGElement>>;
}

export const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  {
    country: "Nigeria",
    warehouse: "Lagos DC1",
    intakeEstimate: "3–5 days intake",
    flag: FlagNg,
  },
  {
    country: "United States",
    warehouse: "Newark DC",
    intakeEstimate: "1–3 days intake",
    flag: FlagUs,
  },
  {
    country: "United Kingdom",
    warehouse: "London DC",
    intakeEstimate: "3–5 days intake",
    flag: FlagGb,
  },
  {
    country: "Germany",
    warehouse: "Frankfurt DC",
    intakeEstimate: "2–4 days intake",
    flag: FlagDe,
  },
  {
    country: "Kenya",
    warehouse: "Nairobi DC",
    intakeEstimate: "4–6 days intake",
    flag: FlagKe,
  },
  {
    country: "India",
    warehouse: "Mumbai DC",
    intakeEstimate: "4–6 days intake",
    flag: FlagIn,
  },
];
