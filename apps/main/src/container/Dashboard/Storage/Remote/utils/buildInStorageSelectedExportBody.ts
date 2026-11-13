import type { IInStorageInventorySelectedExportBody } from "@/types/equipmentsInStorageInventory";
import encryptPayload from "@/utils/encryption/encryptPayload";

export function buildInStorageSelectedExportBody(
  equipmentIds: string[],
): string {
  const body: IInStorageInventorySelectedExportBody = {
    equipment_ids: equipmentIds,
  };
  return encryptPayload(JSON.stringify(body));
}
