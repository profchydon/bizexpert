export const EMP_KEY = "emp:";
export const OFFICE_KEY = "office:";

export function isOfficeKey(key: string): boolean {
  return key.startsWith(OFFICE_KEY);
}

export function selectionLabel(selected: Set<string>): string {
  if (selected.size === 0) return "Nothing selected yet";
  const offices = Array.from(selected).filter(isOfficeKey).length;
  const people = selected.size - offices;
  const parts: string[] = [];
  if (people > 0) {
    parts.push(`${people} ${people === 1 ? "person" : "people"}`);
  }
  if (offices > 0) {
    parts.push(`${offices} ${offices === 1 ? "office" : "offices"}`);
  }
  return `${parts.join(", ")} selected`;
}
