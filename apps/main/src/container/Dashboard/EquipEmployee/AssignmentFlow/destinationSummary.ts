import { cartItemUnitAmount } from "@/utils/cartItemSource";
import { isAssigned } from "./officeContactRules";
import type { AssignmentState, AssignmentUnit } from "./types";

export interface AssignmentSummary {
  total: number;
  unassigned: number;
  people: number;
  offices: number;
  storage: number;
  subtotal: number;
}

export function summariseUnits(units: AssignmentUnit[]): AssignmentSummary {
  const summary: AssignmentSummary = {
    total: 0,
    unassigned: 0,
    people: 0,
    offices: 0,
    storage: 0,
    subtotal: 0,
  };

  for (const { destination, cartItem } of units) {
    summary.total += 1;
    summary.subtotal += cartItemUnitAmount(cartItem);
    if (!isAssigned(destination)) summary.unassigned += 1;
    else if (destination.type === "employee") summary.people += 1;
    else if (destination.type === "office") summary.offices += 1;
    else if (destination.type === "storage") summary.storage += 1;
  }

  return summary;
}

export function summariseAssignments(
  state: AssignmentState,
): AssignmentSummary {
  return summariseUnits(state.assignments);
}

export function describeDestinations(summary: AssignmentSummary): string {
  const parts: string[] = [];
  if (summary.people > 0) {
    parts.push(
      `${summary.people} to ${summary.people === 1 ? "a person" : "people"}`,
    );
  }
  if (summary.offices > 0) {
    parts.push(
      `${summary.offices} to ${summary.offices === 1 ? "an office" : "offices"}`,
    );
  }
  if (summary.storage > 0) {
    parts.push(`${summary.storage} held in storage`);
  }
  return parts.join(" · ");
}

export function describeBlocker(summary: AssignmentSummary): string {
  const n = summary.unassigned;
  return `${n} ${n === 1 ? "device" : "devices"} still ${n === 1 ? "needs" : "need"} a destination`;
}

export function firstUnassignedUnitId(units: AssignmentUnit[]): string | null {
  return units.find((unit) => !isAssigned(unit.destination))?.unitId ?? null;
}

export function unitRowId(unitId: string): string {
  return `unit-${unitId}`;
}
