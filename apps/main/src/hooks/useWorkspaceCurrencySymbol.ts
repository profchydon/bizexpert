import { useWorkspaceEquipmentDefaults } from "./useWorkspaceEquipmentDefaults";
import { currencySymbol as getCurrencySymbol } from "@/utils/currencySymbol";

export function useWorkspaceCurrencySymbol() {
  const { currencyCode } = useWorkspaceEquipmentDefaults();
  return getCurrencySymbol(currencyCode);
}
