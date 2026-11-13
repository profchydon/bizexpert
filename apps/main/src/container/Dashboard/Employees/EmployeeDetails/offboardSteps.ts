import { ActionType } from "@/types/offboarding";

export type OffboardEquipmentNextStep = "selectReceiver" | "selectDate" | null;

/**
 * Decides which drawer opens after equipment is selected during offboarding.
 *
 * Transfer routes to the receiver drawer. Store routes straight to the
 * collection-date drawer: storage duration is no longer collected in this flow
 * and is defaulted downstream (mirrors the Asset Vault store flow).
 */
export const resolveSelectEquipmentNextStep = (
  actionType: ActionType | undefined,
): OffboardEquipmentNextStep => {
  if (actionType === "Transfer") {
    return "selectReceiver";
  }

  if (actionType === "Store") {
    return "selectDate";
  }

  return null;
};
