import { AssignmentUnit } from "./types";
import { getCartCountry } from "./cartCountry";

interface CountryUnitGroup {
  country: { code: string; label: string };
  allUnitIds: string[];
  selectableUnitIds: string[];
}

const groupUnitsByCountry = (
  assignments: AssignmentUnit[],
): CountryUnitGroup[] => {
  const map = new Map<string, CountryUnitGroup>();

  assignments.forEach((assignment) => {
    const { code, label } = getCartCountry(assignment.cartItem);
    const existing = map.get(code);

    if (existing) {
      existing.allUnitIds.push(assignment.unitId);
      if (assignment.destination.type === "unassigned") {
        existing.selectableUnitIds.push(assignment.unitId);
      }
      return;
    }

    map.set(code, {
      country: { code, label },
      allUnitIds: [assignment.unitId],
      selectableUnitIds:
        assignment.destination.type === "unassigned" ? [assignment.unitId] : [],
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.country.label.localeCompare(b.country.label),
  );
};

export type { CountryUnitGroup };
export { groupUnitsByCountry };
