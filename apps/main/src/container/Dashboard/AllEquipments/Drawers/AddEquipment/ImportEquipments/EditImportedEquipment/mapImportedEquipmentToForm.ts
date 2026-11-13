import type { IAddEquipment } from "@/types/equipments";
import type { z } from "zod";
import {
  toApiEquipmentStatus,
  UNASSIGNED_API_EQUIPMENT_STATUS,
} from "@/components/AllEquipments/equipmentListStatus";
import { formatEditPurchaseDateValue } from "../../../editSingleEquipmentForm";
import { editImportedEquipmentSchema } from "./validation";

type EditImportedEquipmentFormValues = z.infer<
  typeof editImportedEquipmentSchema
>;

export const mapImportedEquipmentToForm = (equipment: IAddEquipment) => ({
  title: equipment.title ?? "",
  serial_number: equipment.serial_number ?? "",
  make: equipment.make ?? "",
  model: equipment.model ?? "",
  year: equipment.year ?? "",
  type: equipment.type ?? "",
  state: equipment.state ?? "",
  country: equipment.country ?? "",
  status: toApiEquipmentStatus(
    String(equipment.status ?? UNASSIGNED_API_EQUIPMENT_STATUS),
  ),
  assignee: equipment.assignee ?? "",
  purchase_date: formatEditPurchaseDateValue(equipment.purchase_date),
  purchase_price: String(equipment.purchase_price ?? ""),
  currency_id: String(
    (equipment as { currency_id?: string }).currency_id ?? "",
  ),
  description: equipment.description ?? "",
});

export const canSaveEditImportedEquipment = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  purchasePrice: string | number | null | undefined,
  currencyId: string | undefined,
  status: string | undefined,
  assignee: string | undefined,
) => {
  if ((title?.trim().length ?? 0) < 2 || !type || !state) return false;
  if (!purchasePrice || String(purchasePrice).trim().length < 2) return false;
  if (!currencyId) return false;
  if (status === "Assigned" && !assignee) return false;
  return true;
};

export const getEditImportedEquipmentSaveDisabledReason = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  purchasePrice: string | number | null | undefined,
  currencyId: string | undefined,
  status: string | undefined,
  assignee: string | undefined,
) => {
  if ((title?.trim().length ?? 0) < 2) {
    return "Enter an asset title with at least 2 characters.";
  }
  if (!type) return "Select an equipment type.";
  if (!state) return "Select an asset state.";
  if (!purchasePrice || String(purchasePrice).trim().length < 2) {
    return "Enter a purchase price with at least 2 characters.";
  }
  if (!currencyId) return "Select a currency.";
  if (status === "Assigned" && !assignee) {
    return "Select an assignee when asset status is Assigned.";
  }
  return null;
};

export function mapFormToImportedEquipment(
  equipment: IAddEquipment,
  data: EditImportedEquipmentFormValues,
  imageUrl: string | null,
): IAddEquipment {
  return {
    ...equipment,
    title: data.title,
    serial_number: String(data.serial_number ?? ""),
    make: String(data.make ?? ""),
    model: String(data.model ?? ""),
    year: String(data.year ?? ""),
    type: data.type as IAddEquipment["type"],
    state: data.state as IAddEquipment["state"],
    assignee: data.assignee ? String(data.assignee) : undefined,
    country: data.country ? String(data.country) : undefined,
    description: String(data.description ?? ""),
    purchase_date: data.purchase_date ? String(data.purchase_date) : undefined,
    purchase_price: String(data.purchase_price ?? ""),
    currency_id: data.currency_id,
    imageUrl,
    status: data.assignee ? "Assigned" : UNASSIGNED_API_EQUIPMENT_STATUS,
  } as IAddEquipment;
}
