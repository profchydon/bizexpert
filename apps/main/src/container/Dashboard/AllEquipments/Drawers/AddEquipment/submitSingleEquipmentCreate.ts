import type { z } from "zod";
import type { CreateEquipmentRequest } from "@/types/equipments";
import type { addSingleEquipmentSchema } from "./SingleEquipment/validation";
import { buildSingleEquipmentEditFormData } from "../submitSingleEquipmentEdit";
import { isFuturePurchaseDate } from "./equipmentPurchaseDateLimits";

type FormValues = z.infer<typeof addSingleEquipmentSchema>;

export const buildCreateEquipmentFormData = (
  data: FormValues,
  imageFile: Blob | string | undefined,
) => {
  const formData = buildSingleEquipmentEditFormData(data, imageFile);

  if (data.assignee) {
    formData.append("assignee", String(data.assignee));
  }
  if (data.description && String(data.description) !== "null") {
    formData.append("description", String(data.description));
  }
  return formData;
};

export const buildCreateEquipmentPayload = (
  companyId: string,
  data: FormValues,
  imageFile: Blob | string | undefined,
): CreateEquipmentRequest => ({
  companyId,
  payload: buildCreateEquipmentFormData(data, imageFile),
});

export const canSaveAddEquipment = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  status: string | undefined,
  assignee: string | undefined,
  isSaving: boolean,
  purchaseDate?: string,
) => {
  if (isSaving) return false;
  if ((title?.trim().length ?? 0) < 2 || !type || !state) return false;
  if (status === "Assigned" && !assignee) return false;
  if (isFuturePurchaseDate(purchaseDate)) return false;
  return true;
};

export const getAddEquipmentSaveDisabledReason = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  status: string | undefined,
  assignee: string | undefined,
  isSaving: boolean,
  purchaseDate?: string,
) => {
  if (isSaving) return "Saving equipment.";
  if ((title?.trim().length ?? 0) < 2) {
    return "Enter an asset title with at least 2 characters.";
  }
  if (!type) return "Select an equipment type.";
  if (!state) return "Select an asset state.";
  if (status === "Assigned" && !assignee) {
    return "Select an assignee when asset status is Assigned.";
  }
  if (isFuturePurchaseDate(purchaseDate)) {
    return "Purchase date cannot be in the future.";
  }
  return null;
};
