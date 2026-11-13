import { useAppSelector } from "@/store";

export const useShouldDisableActionItem = () => {
  const storageToEmployeeItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );

  const renewStorageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.renewStorageItems,
  );

  const storageItems = Array.isArray(storageToEmployeeItems)
    ? storageToEmployeeItems
    : [];
  const renewItems = Array.isArray(renewStorageItems) ? renewStorageItems : [];

  const bothEmpty = storageItems.length === 0 && renewItems.length === 0;

  const shouldHideAssign = !bothEmpty && renewItems.length > 0;
  const shouldHideRenew = !bothEmpty && storageItems.length > 0;

  return {
    hideAssign: shouldHideAssign,
    hideRenew: shouldHideRenew,
  };
};
