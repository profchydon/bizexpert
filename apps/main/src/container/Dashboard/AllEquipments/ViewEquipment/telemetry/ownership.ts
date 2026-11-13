import type { Ownership } from "./types";

export function resolveOwnership(row: {
  ownership?: Ownership | null;
  telemetry_ownership?: Ownership | null;
  source?: string | null;
}): Ownership {
  if (row.ownership) return row.ownership;
  if (
    row.telemetry_ownership === "company" ||
    row.telemetry_ownership === "employee"
  ) {
    return row.telemetry_ownership;
  }
  return row.source === "Self-Reported" ? "employee" : "company";
}

export const OWNERSHIP_LABEL: Record<Ownership, string> = {
  company: "Company owned",
  employee: "Employee owned",
};

export const OWNERSHIP_TOOLTIP: Record<Ownership, string> = {
  company:
    "Purchased and owned by the company. Full telemetry and lifecycle actions.",
  employee:
    "The employee's personal device. Basic signals only, and fewer actions.",
};
