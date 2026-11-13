import type { IAsset, ISpec } from "@/types/assets";
import type { IEmployeeCatalogPolicy } from "@/types/employees";
import type { IKitItem } from "@/types/kit";
import { assetToEquipItem } from "./assetToEquipItem";
import type { EquipDeviceItem } from "./equipTypes";

interface RawPricing {
  id?: string;
  amount?: number | string;
  currency?: { code?: string; name?: string; symbol?: string };
}

interface RawSpec {
  id?: string;
  asset_spec_id?: string;
  asset_id?: string;
  name?: string;
  description?: string;
  category?: string;
  images?: string[] | null;
  spec?: Record<string, unknown> | null;
  asset_pricing?: RawPricing | null;
}

const specObjectToArray = (
  spec: Record<string, unknown> | null | undefined,
): ISpec[] =>
  Object.entries(spec ?? {}).map(([name, value]) => ({
    name,
    value: String(value ?? ""),
  }));

export const catalogSpecToAsset = (raw: RawSpec): IAsset =>
  ({
    id: raw.id ?? raw.asset_spec_id ?? "",
    asset_id: raw.asset_id ?? raw.id ?? "",
    asset_spec_id: raw.asset_spec_id ?? raw.id ?? "",
    name: raw.name ?? "Device",
    description: raw.description ?? "",
    category: raw.category ?? "",
    spec: specObjectToArray(raw.spec),
    images: raw.images ?? [],
    asset_pricing: {
      id: raw.asset_pricing?.id ?? "",
      amount: String(raw.asset_pricing?.amount ?? "0"),
      currency: {
        code: raw.asset_pricing?.currency?.code ?? "USD",
        name: raw.asset_pricing?.currency?.name ?? "",
        symbol: raw.asset_pricing?.currency?.symbol ?? "",
      },
    },
    year: "",
    type: "",
    make: "",
    model: "",
    assetCode: "",
    status: "",
    country: "",
    createdAt: "",
    updatedAt: "",
  }) as IAsset;

export const policyItemToEquipItem = (
  item: IKitItem,
): EquipDeviceItem | null => {
  const raw = item.asset_specification as RawSpec | null | undefined;
  if (!raw) return null;

  const asset = catalogSpecToAsset(raw);
  if (!asset.asset_pricing?.id) return null;

  return {
    ...assetToEquipItem(asset),
    origin: "FROM_POLICY",
    quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
  };
};

export const catalogPoliciesToEquipItems = (
  policies: IEmployeeCatalogPolicy[] | undefined,
): EquipDeviceItem[] => {
  const items: EquipDeviceItem[] = [];
  const seen = new Set<string>();

  (policies ?? []).forEach((policy) => {
    (policy.kits?.data ?? []).forEach((kit) => {
      (kit.items?.data ?? []).forEach((kitItem) => {
        const equipItem = policyItemToEquipItem(kitItem);
        if (equipItem && !seen.has(equipItem.lineId)) {
          seen.add(equipItem.lineId);
          items.push(equipItem);
        }
      });
    });
  });

  return items;
};
