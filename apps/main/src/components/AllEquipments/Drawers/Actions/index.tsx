import React, { useEffect } from "react";
import DrawerRight from "@/components/DrawerRight";
import ActionCard from "./ActionCard";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { useAppDispatch, useAppSelector } from "@/store";
import { Offboard_asset } from "@/types/offboarding";
import { deleteOffboardingData } from "@/store/slices/offboardingSlice";
import { removeItemsNotCompleted } from "@/components/Offboarding/util";

interface Props {
  isOpen: boolean;
  baseRoute: string;
  onClose: () => void;
  onContinue?: () => void;
  onTransferEdit: () => void;
  onStoreEdit: () => void;
  onSaleEdit: () => void;
  handleAddAction?: () => void;
  transferRoute?: (value: string) => string;
  storeRoute?: (value: string) => string;
  saleRoute?: (value: string) => string;
}

const ActionsDrawer: React.FC<Props> = ({
  isOpen,
  baseRoute,
  onClose,
  onContinue,
  onTransferEdit,
  onStoreEdit,
  onSaleEdit,
  transferRoute,
  storeRoute,
  saleRoute,
  handleAddAction,
}) => {
  const { push } = useTransitionRouter();
  const dispatch = useAppDispatch();
  const offboardingData = useAppSelector(
    (state) => state.persistedReducers.offboarding,
  ) as Offboard_asset;

  useEffect(() => {
    if (!offboardingData && isOpen) {
      onClose();
    }
  }, [offboardingData]);

  const handleEdit = ({
    id,
    actionType,
  }: {
    id: string;
    actionType: "Transfer" | "Store" | "Sale";
  }) => {
    switch (actionType) {
      case "Transfer":
        push(transferRoute ? transferRoute(id) : `${baseRoute}?equip_id=${id}`);
        onTransferEdit?.();
        break;
      case "Store":
        push(
          storeRoute
            ? storeRoute(id)
            : `${baseRoute}?equip_id=${id}&action_edit_store={true}`,
        );
        onStoreEdit();
        break;
      case "Sale":
        push(
          saleRoute
            ? saleRoute(id)
            : `${baseRoute}?equip_id=${id}&action_edit_store={true}`,
        );
        onSaleEdit();
        break;
      default:
        console.warn(`Unhandled action type: ${actionType}`);
    }
  };

  const handleRemove = (id: string) => {
    dispatch(deleteOffboardingData(id));
  };

  const handleAddMoreActions = () => {
    onClose();
    handleAddAction?.();
    removeItemsNotCompleted(offboardingData, dispatch);
  };

  const handleSubmit = () => {
    onClose();
    removeItemsNotCompleted(offboardingData, dispatch);
    onContinue ? onContinue() : push(`${baseRoute}/view-actions`);
  };

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
        drawerDescription="See all actions and edit"
        data-testid="actions-drawerright"
      >
        <div className="space-y-6 mt-6 px-0">
          {Array.isArray(offboardingData) ? (
            offboardingData
              .filter((item) => item?.statusFlow === "Completed")
              .map((item) => (
                <ActionCard
                  key={item.id}
                  item={item}
                  onEdit={() =>
                    handleEdit({ id: item.id, actionType: item?.actionType })
                  }
                  onRemove={() => handleRemove(item.id)}
                />
              ))
          ) : offboardingData?.statusFlow === "Completed" ? (
            <ActionCard
              item={offboardingData}
              onEdit={() =>
                handleEdit({
                  id: offboardingData?.id,
                  actionType: offboardingData?.actionType as any,
                })
              }
              onRemove={() => handleRemove(offboardingData?.id)}
            />
          ) : null}
        </div>
      </DrawerRight>
    </div>
  );
};

export default ActionsDrawer;
