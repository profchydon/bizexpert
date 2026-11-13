import { convertTime } from "@/utils/convertTime";
import type { IAssetRefresh, IAssetRefreshItem } from "@/types/assetRefresh";

type RefreshAsset = IAssetRefreshItem & { id?: string };

export const normalizeEquipmentRefreshKey = (type: string) =>
  type.toLowerCase().replace(/[^a-zA-Z0-9]/g, "_");

export const buildEquipmentRefreshDefaults = (assetData?: RefreshAsset[]) => {
  const values: Record<string, unknown> = {};

  assetData?.forEach((asset) => {
    const baseKey = normalizeEquipmentRefreshKey(asset.asset_type);
    const period = convertTime(
      Number(asset.refresh_period_in_months),
      "toYears",
    );
    values[baseKey] = (period as number) > 0;
    values[`${baseKey}RefreshPeriod`] = (period as number) ? period : undefined;
  });

  return values;
};

export const isEquipmentRefreshSubmitEnabled = (
  assetData: RefreshAsset[] | undefined,
  values: Record<string, unknown>,
) => {
  if (!assetData) return false;

  return assetData.some((asset) => {
    const baseKey = normalizeEquipmentRefreshKey(asset.asset_type);
    const period = values[`${baseKey}RefreshPeriod`];
    return Boolean(values[baseKey]) && period !== undefined && period !== "";
  });
};

export const buildEquipmentRefreshList = (
  assetData: RefreshAsset[] | undefined,
  data: Record<string, unknown>,
): IAssetRefresh[] => {
  if (!assetData) return [];

  const list: IAssetRefresh[] = [];
  for (const asset of assetData) {
    const baseKey = normalizeEquipmentRefreshKey(asset.asset_type);
    const period = data[`${baseKey}RefreshPeriod`];
    const assetTypeId = asset.id ?? asset.asset_type_id;
    if (!data[baseKey] || period === undefined || !assetTypeId) continue;
    list.push({
      asset_type_id: assetTypeId,
      refresh_period_in_months: convertTime(Number(period), "toMonths"),
    });
  }
  return list;
};
