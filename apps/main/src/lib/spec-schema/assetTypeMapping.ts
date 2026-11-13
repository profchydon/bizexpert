export interface AssetTypeMapping {
  schemaId: string;
  peripheralSubtype?: string;
}

export const ASSET_TYPE_SPEC_MAPPING: Record<string, AssetTypeMapping> = {
  laptop: { schemaId: "laptop" },
  monitors: { schemaId: "monitor" },
  phone: { schemaId: "phone_tablet" },
  tablet: { schemaId: "phone_tablet" },
  keyboard: { schemaId: "peripheral", peripheralSubtype: "keyboard" },
  mouse: { schemaId: "peripheral", peripheralSubtype: "mouse" },
  headphones: { schemaId: "peripheral", peripheralSubtype: "headset" },
  webcam: { schemaId: "peripheral", peripheralSubtype: "webcam" },
  earpods: { schemaId: "peripheral", peripheralSubtype: "headset" },
  chargers: { schemaId: "accessory" },
  other: { schemaId: "accessory" },
};

export function getSchemaIdForAssetType(
  assetType: string | null | undefined,
): string | null {
  if (!assetType) return null;
  return ASSET_TYPE_SPEC_MAPPING[assetType]?.schemaId ?? null;
}

export function getPeripheralSubtypeForAssetType(
  assetType: string | null | undefined,
): string | null {
  if (!assetType) return null;
  return ASSET_TYPE_SPEC_MAPPING[assetType]?.peripheralSubtype ?? null;
}

const ASSET_TYPE_LABELS: Record<string, string> = {
  laptop: "Laptop",
  monitors: "Monitor",
  phone: "Phone",
  tablet: "Tablet",
  keyboard: "Keyboard",
  mouse: "Mouse",
  headphones: "Headphones",
  webcam: "Webcam",
  earpods: "Earpods",
  chargers: "Charger",
  other: "Other",
};

export function getAssetTypeLabel(
  assetType: string | null | undefined,
): string {
  if (!assetType) return "";
  return (
    ASSET_TYPE_LABELS[assetType] ??
    assetType.charAt(0).toUpperCase() + assetType.slice(1)
  );
}
