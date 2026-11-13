import type { IAsset, ISpec } from "@/types/assets";
import { getDefaultDeviceConfig } from "./equipDeviceConfig";
import type { EquipDeviceItem } from "./equipTypes";

const CONDITION_KEYS = new Set(["condition", "spec_condition", "state"]);

const specValues = (spec: ISpec[] | undefined): string[] =>
  (spec ?? [])
    .filter((entry) => !CONDITION_KEYS.has((entry?.name ?? "").toLowerCase()))
    .map((entry) => entry?.value)
    .filter((value): value is string => Boolean(value && value.trim()));

const toAmount = (amount: unknown): number | null => {
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : null;
};

export const assetToEquipItem = (asset: IAsset): EquipDeviceItem => ({
  lineId: asset.id,
  productId: asset.asset_id ?? asset.id,
  name: asset.name,
  category: asset.category || undefined,
  specs: specValues(asset.spec).slice(0, 3).join(" · ") || undefined,
  thumbnail: asset.images?.[0],
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: toAmount(asset.asset_pricing?.amount),
  currency: asset.asset_pricing?.currency?.code ?? "USD",
  quantity: 1,
  config: getDefaultDeviceConfig({
    name: asset.name,
    category: asset.category || undefined,
  }),
  asset,
});
