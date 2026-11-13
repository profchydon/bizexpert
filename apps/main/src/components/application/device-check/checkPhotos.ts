// Mock device-check photos (real free photos pulled from Unsplash into
// /public/devices/checks). Uncaptioned, since vendors don't caption their shots.
// Keyed by the storage `assetType`; falls back to a generic set.

import { resolveCheckAssetLookup } from "./resolveCheckAssetType";

const paths = (cat: string, n: number): string[] =>
  Array.from({ length: n }, (_, i) => `/devices/checks/${cat}/${i + 1}.jpg`);

const CHECK_PHOTOS: Record<string, string[]> = {
  laptop: paths("laptop", 5),
  monitors: paths("monitor", 5),
  monitor: paths("monitor", 5),
  display: paths("monitor", 5),
  phone: paths("phone", 5),
  tablet: paths("tablet", 5),
  keyboard: paths("keyboard", 5),
  mouse: paths("keyboard", 5),
  headphones: paths("headphones", 5),
  earpods: paths("headphones", 5),
  audio: paths("headphones", 5),
  other: paths("generic", 5),
};

const GENERIC = paths("generic", 5);

export function getCheckPhotos(assetType: string | undefined | null): string[] {
  return CHECK_PHOTOS[resolveCheckAssetLookup(assetType)] ?? GENERIC;
}
