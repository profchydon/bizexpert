import { assetCategoryLabel, assetSpecLabels } from "../utils";

export interface AssetEntry {
  id: string;
  name: string;
  image: string | null;
  category: string | null;
  specs: string[];
}

export function normalizeAssets(raw: unknown): AssetEntry[] {
  return extractAssets(raw).flatMap((entry) => {
    const id =
      entry.id ?? entry.asset_specification_id ?? entry.specification_id;
    if (!id) return [];
    const images = Array.isArray(entry.images)
      ? entry.images
      : entry.image
        ? [entry.image]
        : [];
    const asset: AssetEntry = {
      category: assetCategoryLabel(entry),
      id: String(id),
      image: images[0] ?? null,
      name: String(entry.name ?? entry.title ?? "Unnamed item"),
      specs: assetSpecLabels(entry).slice(0, 3),
    };
    return [asset];
  });
}

function extractAssets(raw: unknown): Record<string, any>[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== "object") return [];
  const data = (raw as Record<string, unknown>).data;
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as Record<string, unknown>).data)
  ) {
    return (data as { data: Record<string, any>[] }).data;
  }
  const candidate = Object.values(raw as Record<string, unknown>).find(
    Array.isArray,
  );
  return Array.isArray(candidate) ? candidate : [];
}
