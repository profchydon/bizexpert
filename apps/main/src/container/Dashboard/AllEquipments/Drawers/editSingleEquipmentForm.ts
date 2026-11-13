import { toValidDate } from "@/utils/toValidDate";
import { isFuturePurchaseDate } from "./AddEquipment/equipmentPurchaseDateLimits";

export const canSaveEditEquipment = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  isSaving: boolean,
  isLoading: boolean,
  purchaseDate?: string,
) =>
  (title?.trim().length ?? 0) >= 2 &&
  Boolean(type) &&
  Boolean(state) &&
  !isSaving &&
  !isLoading &&
  !isFuturePurchaseDate(purchaseDate);

export const getEditEquipmentSaveDisabledReason = (
  title: string | undefined,
  type: string | undefined,
  state: string | undefined,
  isSaving: boolean,
  isLoading: boolean,
  equipmentId?: string,
  purchaseDate?: string,
) => {
  if (isSaving) return "Saving changes.";
  if (isLoading) return "Loading equipment details.";
  if (!equipmentId) return "No equipment selected.";
  if ((title?.trim().length ?? 0) < 2) {
    return "Enter an asset title with at least 2 characters.";
  }
  if (!type) return "Select an equipment type.";
  if (!state) return "Select an asset state.";
  if (isFuturePurchaseDate(purchaseDate)) {
    return "Purchase date cannot be in the future.";
  }
  return null;
};

export const formatEditPurchaseDateValue = (
  value: string | Date | undefined,
) => {
  const date = toValidDate(value);
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
