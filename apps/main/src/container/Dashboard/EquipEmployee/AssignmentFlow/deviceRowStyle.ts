import type { AssignmentDestination } from "./types";

const CONDITION_TOOLTIP: Record<string, string> = {
  "brand new": "Unused and sealed, with the full manufacturer warranty.",
  refurbished:
    "Professionally restored and tested, covered by a Rayda warranty.",
  used: "Previously owned and inspected. Priced lower, sold as seen.",
};

export function conditionTooltip(label: string): string {
  return (
    CONDITION_TOOLTIP[label.trim().toLowerCase()] ??
    "The condition this device ships in."
  );
}

export function destinationRail(
  destination: AssignmentDestination,
): string | null {
  return destination.type === "unassigned" ? null : "bg-utility-gray-500";
}
