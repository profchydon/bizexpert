import type { CatalogRule, MockEmployee } from "./types";

export const baseRule: CatalogRule = {
  id: "rule-a",
  name: "Engineering Nigeria",
  purpose: "ONBOARDING",
  matchRoles: ["Engineer"],
  matchLevels: ["L4"],
  matchDepartments: ["Engineering"],
  matchCountries: ["Nigeria"],
  kitIds: ["kit-1"],
  selectionMode: "FIXED",
  triggerType: "MANUAL",
  allowItemSwap: true,
  includeCompanyStorage: true,
  storageMinGrade: "GRADE_A_ONLY",
  specificityScore: 6,
  status: "ACTIVE",
  createdAt: "2026-04-01T00:00:00Z",
  updatedAt: "2026-04-01T00:00:00Z",
};

export const employees: MockEmployee[] = [
  {
    id: "emp-1",
    name: "Tunde Okafor",
    role: "Engineer",
    level: "L4",
    department: "Engineering",
    country: "Nigeria",
    countryCode: "NG",
  },
  {
    id: "emp-2",
    name: "Sarah Thompson",
    role: "Engineer",
    level: "L4",
    department: "Engineering",
    country: "United Kingdom",
    countryCode: "GB",
  },
];
