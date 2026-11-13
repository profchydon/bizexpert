import type { Subsidiary } from "../types";

export function delegatedCostCentres(
  billingEntityId: string,
  subsidiaries: Subsidiary[],
): Subsidiary[] {
  return subsidiaries.filter(
    (subsidiary) =>
      subsidiary.billingMode === "delegated" &&
      subsidiary.billingEntityId === billingEntityId,
  );
}
