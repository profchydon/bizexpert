import type { IEquipmentsInStorageByCountry } from "@/types/equipments";

const STORAGE_SPEC_ORDER = [
  "processor",
  "memory",
  "storage",
  "display",
  "color",
] as const;

export const buildStorageDeviceSpecs = (
  specs?: IEquipmentsInStorageByCountry["specs"],
): string | undefined => {
  if (!specs) return undefined;

  const parts = STORAGE_SPEC_ORDER.map((key) => specs[key]?.trim()).filter(
    Boolean,
  );

  return parts.length > 0 ? parts.join(" · ") : undefined;
};
