import type {
  AssignmentDestination,
  AssignmentUnit,
  ContactSource,
} from "./types";

export interface OfficeContact {
  contactEmployeeId: string;
  contactEmployeeName: string;
}

export function officeDefaultContact(
  assignments: AssignmentUnit[],
  officeId: string,
): OfficeContact | null {
  for (const unit of assignments) {
    const { destination, contactSource } = unit;
    if (
      destination.type !== "office" ||
      destination.officeId !== officeId ||
      contactSource === "row"
    ) {
      continue;
    }
    return {
      contactEmployeeId: destination.contactEmployeeId,
      contactEmployeeName: destination.contactEmployeeName,
    };
  }
  return null;
}

export function contactSourceFor(
  pickedId: string,
  officeDefault: OfficeContact | null | undefined,
): ContactSource {
  return officeDefault && officeDefault.contactEmployeeId === pickedId
    ? "office-default"
    : "row";
}

export function withInheritedContact(
  assignments: AssignmentUnit[],
  destination: AssignmentDestination,
): AssignmentDestination {
  if (destination.type !== "office") return destination;
  const shared = officeDefaultContact(assignments, destination.officeId);
  return shared ? { ...destination, ...shared } : destination;
}

export function assignDestination(
  unit: AssignmentUnit,
  destination: AssignmentDestination,
): AssignmentUnit {
  return {
    ...unit,
    destination,
    contactSource: destination.type === "office" ? "office-default" : undefined,
  };
}

function withContact(
  unit: AssignmentUnit,
  contact: OfficeContact,
  source: ContactSource,
): AssignmentUnit {
  if (unit.destination.type !== "office") return unit;
  return {
    ...unit,
    destination: {
      ...unit.destination,
      contactEmployeeId: contact.contactEmployeeId,
      contactEmployeeName: contact.contactEmployeeName,
    },
    contactSource: source,
  };
}

export function applyOfficeDefaultContact(
  assignments: AssignmentUnit[],
  officeId: string,
  contact: OfficeContact,
): AssignmentUnit[] {
  return assignments.map((unit) =>
    unit.destination.type === "office" &&
    unit.destination.officeId === officeId &&
    unit.contactSource !== "row"
      ? withContact(unit, contact, "office-default")
      : unit,
  );
}

export function applyRowContact(
  assignments: AssignmentUnit[],
  unitId: string,
  contact: OfficeContact,
  source: ContactSource,
): AssignmentUnit[] {
  return assignments.map((unit) =>
    unit.unitId === unitId ? withContact(unit, contact, source) : unit,
  );
}

export function applySelectedContact(
  assignments: AssignmentUnit[],
  selectedIds: Set<string>,
  contact: OfficeContact,
  source: ContactSource,
): AssignmentUnit[] {
  return assignments.map((unit) =>
    selectedIds.has(unit.unitId) ? withContact(unit, contact, source) : unit,
  );
}

export function isAssigned(destination: AssignmentDestination): boolean {
  if (destination.type === "unassigned") return false;
  if (destination.type === "office")
    return Boolean(destination.contactEmployeeId);
  return true;
}
