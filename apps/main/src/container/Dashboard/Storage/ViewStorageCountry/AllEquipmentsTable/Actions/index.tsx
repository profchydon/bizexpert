import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import DrawerFooter from "@/components/DrawerRight/DrawerFooter";
import ActionCard from "./ActionCard";
import {
  removeRenewStorageItems,
  removeStorageToEmployeeItem,
} from "@/store/slices/equipEmployeeSlice";
import routes from "@/routes";
import { useShouldDisableActionItem } from "@/hooks/useShouldDisableActionItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleAddAction?: () => void;
}

const ActionsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  handleAddAction,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storageToEmployeeItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.storageToEmployeeItems,
  );

  const renewStorageItems = useAppSelector(
    (state) => state.persistedReducers.equipEmployee.renewStorageItems,
  );

  const { hideAssign, hideRenew } = useShouldDisableActionItem();

  const handleAddMoreActions = () => {
    onClose();
    handleAddAction?.();
  };

  const handleSubmit = () => {
    onClose();
    if (!hideAssign) {
      router.push(routes.STORAGE_SELECT_EMPLOYEES);
      return;
    }

    if (!hideRenew) {
      router.push(routes.STORAGE_ACTION);
      return;
    }
  };

  useEffect(() => {
    if (
      !storageToEmployeeItems ||
      storageToEmployeeItems.length === 0 ||
      !renewStorageItems ||
      renewStorageItems?.length < 1
    ) {
      onClose();
    }
  }, [storageToEmployeeItems, renewStorageItems]);

  return (
    <div>
      <DrawerRight
        isOpen={isOpen}
        onClose={onClose}
        onCancel={handleAddMoreActions}
        onSave={handleSubmit}
        saveText={"Continue"}
        cancelText={"Add more actions"}
        drawerTitle="Actions"
        drawerDescription="See all actions and remove"
        data-testid="actions-drawerright"
      >
        <div className="space-y-6 mt-2 px-0 mb-[70px]">
          {[
            ...(Array.isArray(storageToEmployeeItems)
              ? storageToEmployeeItems
              : []),
            ...(Array.isArray(renewStorageItems) ? renewStorageItems : []),
          ]?.map((item) => (
            <ActionCard
              key={item?.id}
              item={item as any}
              onRemove={() => {
                if (item?.actionType !== "store") {
                  dispatch(removeStorageToEmployeeItem(item?.id as string));
                }
                return dispatch(removeRenewStorageItems(item?.id as string));
              }}
            />
          ))}
        </div>

        <DrawerFooter onClose={onClose} submitButtonType="button" />
      </DrawerRight>
    </div>
  );
};

export default ActionsDrawer;
