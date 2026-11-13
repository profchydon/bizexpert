import type { IAsset } from "@/types/assets";
import type { EquipDeviceItem } from "./equipTypes";

export const asset = (): IAsset =>
  ({
    id: "spec-1",
    asset_id: "asset-1",
    asset_spec_id: "assetspec-1",
    name: "Apple MacBook Air M3",
    category: "Macbook",
    spec: [{ name: "Ram", value: "16GB" }],
    images: ["https://assets.rayda.co/one.png"],
    asset_pricing: {
      id: "pricing-1",
      amount: "3000",
      currency: { code: "GBP", name: "Pound", symbol: "£" },
    },
  }) as unknown as IAsset;

export const item = (
  overrides: Partial<EquipDeviceItem> = {},
): EquipDeviceItem => ({
  lineId: "line-1",
  productId: "asset-1",
  name: "Apple MacBook Air M3",
  source: "MARKETPLACE",
  origin: "MANUAL",
  unitPrice: 3000,
  currency: "GBP",
  quantity: 2,
  config: "ABM",
  asset: asset(),
  ...overrides,
});
