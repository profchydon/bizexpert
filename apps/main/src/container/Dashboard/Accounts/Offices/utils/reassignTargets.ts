import type { Office } from "../../types";

export type ReassignSource = Pick<Office, "id" | "subsidiaryId">;

export function filterReassignTargets(
  offices: Office[],
  source: ReassignSource,
): Office[] {
  return offices.filter(
    (office) =>
      office.id !== source.id &&
      office.status !== "closed" &&
      office.subsidiaryId === source.subsidiaryId,
  );
}
