export type StorageFeeByAssetType = Record<string, number>;

const TYPE_ALIASES: Record<string, string> = {
  accessory: "Accessories",
  accessories: "Accessories",
  computer: "Computer",
  laptop: "Laptop/Workstation",
  "laptop/workstation": "Laptop/Workstation",
  workstation: "Laptop/Workstation",
  macbook: "Macbook",
  phone: "Phones",
  phones: "Phones",
  tablet: "Tablet",
};

export const toFeeAmount = (value: unknown): number => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

export const normalizeAssetTypeKey = (value: string): string =>
  value.toLowerCase().replace(/[\s_\-/]+/g, "");

export const parseStorageFees = (
  storage: unknown,
): { defaultStorage: number; storageByType: StorageFeeByAssetType } => {
  if (storage && typeof storage === "object" && !Array.isArray(storage)) {
    const storageByType: StorageFeeByAssetType = {};
    Object.entries(storage as Record<string, unknown>).forEach(
      ([key, value]) => {
        const amount = toFeeAmount(value);
        if (key) storageByType[key] = amount;
      },
    );
    return { defaultStorage: 0, storageByType };
  }

  return { defaultStorage: toFeeAmount(storage), storageByType: {} };
};

export const storageFeeForAssetType = (
  storageByType: StorageFeeByAssetType,
  defaultStorage: number,
  assetType?: string | null,
): number => {
  const keys = Object.keys(storageByType);
  if (keys.length === 0) return defaultStorage;

  const raw = (assetType ?? "").trim();
  if (!raw) return defaultStorage;

  const direct = storageByType[raw];
  if (typeof direct === "number") return direct;

  const normalized = normalizeAssetTypeKey(raw);
  const matchedKey = keys.find(
    (key) => normalizeAssetTypeKey(key) === normalized,
  );
  if (matchedKey) return storageByType[matchedKey];

  const alias =
    TYPE_ALIASES[raw.toLowerCase()] ?? TYPE_ALIASES[normalized] ?? "";
  if (alias && typeof storageByType[alias] === "number") {
    return storageByType[alias];
  }

  return defaultStorage;
};
