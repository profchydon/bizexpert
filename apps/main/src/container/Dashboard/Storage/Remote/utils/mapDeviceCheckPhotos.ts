import type { IInStorageEquipmentDetailCheckPhoto } from "@/types/equipmentsInStorageInventory";

export function mapDeviceCheckPhotos(
  photos: IInStorageEquipmentDetailCheckPhoto[] | undefined,
): string[] {
  if (!photos?.length) return [];
  return photos.flatMap((photo) => {
    if (typeof photo === "string") {
      const src = photo.trim();
      return src ? [src] : [];
    }
    const src = photo?.url?.trim();
    return src ? [src] : [];
  });
}
