type OfficeAssignmentTag =
  | "Offices"
  | "Employees"
  | "Equipment"
  | { type: "Office"; id: string };

export function officeAssignmentTags(
  memberTag: "Employees" | "Equipment",
  officeId: string,
  sourceOfficeId?: string,
): OfficeAssignmentTag[] {
  const tags: OfficeAssignmentTag[] = [
    "Offices",
    memberTag,
    { type: "Office", id: officeId },
  ];
  if (sourceOfficeId && sourceOfficeId !== officeId) {
    tags.push({ type: "Office", id: sourceOfficeId });
  }
  return tags;
}
