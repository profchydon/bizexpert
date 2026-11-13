const ASSET_TYPE_ALIASES: Record<string, string> = {
  "laptop/workstation": "laptop",
  laptop: "laptop",
  smartphone: "phone",
  phone: "phone",
  phones: "phone",
  "input device": "keyboard",
  "audio / visual": "headphones",
  "audio/visual": "headphones",
};

export function resolveCheckAssetLookup(
  assetType: string | undefined | null,
): string {
  const key = (assetType ?? "").trim().toLowerCase();
  return ASSET_TYPE_ALIASES[key] ?? key;
}
