import type { Subsidiary } from "../types";

export function isPrimaryEntity(
  subsidiary: Pick<Subsidiary, "id" | "isPrimary">,
  companyId?: string | null,
): boolean {
  return (
    Boolean(subsidiary.isPrimary) ||
    Boolean(companyId && subsidiary.id === companyId)
  );
}
