"use client";

import { formatCurrencyAmount } from "@/container/Dashboard/Accounts/utils/formatCurrencyAmount";
import type { IDashboard } from "@/types/dashboard";
import { EntityEquipmentFootprintCard } from "./EntityEquipmentFootprintCard";
import { EntityOfficesFootprintCard } from "./EntityOfficesFootprintCard";
import {
  dashboardEquipmentPanel,
  dashboardOfficesPanel,
  equipmentConditionSlices,
  equipmentMixFromPanel,
  isDashboardEquipmentVisible,
  isDashboardOfficesVisible,
  officesAreasFromPanel,
} from "./dashboardEntityFootprint";

export function EntityFootprintSection({
  dashboard,
  region,
  currency,
}: Readonly<{
  dashboard: IDashboard;
  region: string;
  currency: string;
}>) {
  const equipmentPanel = dashboardEquipmentPanel(dashboard);
  const officesPanel = dashboardOfficesPanel(dashboard);
  const showEquipment = isDashboardEquipmentVisible(dashboard);
  const showOffices = isDashboardOfficesVisible(dashboard);

  if (!showEquipment && !showOffices) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
      {showEquipment ? (
        <EntityEquipmentFootprintCard
          region={region}
          inStorage={equipmentPanel?.in_storage ?? 0}
          assetCount={equipmentPanel?.total_assets ?? 0}
          assetValue={formatCurrencyAmount(
            currency,
            equipmentPanel?.asset_value ?? 0,
          )}
          categories={equipmentMixFromPanel(equipmentPanel)}
          conditions={equipmentConditionSlices(equipmentPanel)}
        />
      ) : null}
      {showOffices ? (
        <EntityOfficesFootprintCard
          region={region}
          total={officesPanel?.total ?? 0}
          physical={officesPanel?.physical ?? 0}
          remote={officesPanel?.remote ?? 0}
          areas={officesAreasFromPanel(officesPanel)}
        />
      ) : null}
    </div>
  );
}
