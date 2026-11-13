import type { EntityCostCentreSpend } from "./entityDetailTypes";
import { mapEntityCountryLabel } from "./mapEntityCountryLabel";

export type UiCostCentreSpendRow = {
  id: string;
  name: string;
  region: string;
  spendThisMonth: number;
};

export function mapEntityCostCentreSpend(
  spend: EntityCostCentreSpend | null | undefined,
) {
  const rows: UiCostCentreSpendRow[] = (spend?.entities ?? []).map(
    (entity) => ({
      id: entity.id,
      name: entity.name,
      region: mapEntityCountryLabel(entity.country),
      spendThisMonth: entity.spend_this_month ?? 0,
    }),
  );

  return {
    rows,
    totalThisMonth: spend?.total_this_month ?? 0,
  };
}
