import { resolveEquipmentType } from "@/container/Dashboard/AllEquipments/Drawers/AllEquipmentsDetail/equipmentDetailFormat";

export const resolveAssetTypeName = (
  type?: string | null,
  assetTypes?: { id: string; name: string }[],
): string | undefined =>
  resolveEquipmentType(type, assetTypes) ?? type ?? undefined;
