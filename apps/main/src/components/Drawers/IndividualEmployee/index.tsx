import React from "react";
import DrawerRight from "@/components/DrawerRight";
import { IOrder, ISubOrder } from "@/types/orders";
import { IAsset } from "@/types/assets";
import { OrderFlowType } from "@/types/offboarding";
import OnboardingInstance from "./OnboardingInstance";
import OffboardingInstance from "./OffboardingInstance";
import DeviceRefreshInstance from "./DeviceRefreshInstance";
import BuyToStorageInstance from "./BuyToStorageInstance";
import ReferenceEmployeeSlideout from "./ReferenceEmployeeSlideout";

interface Props {
  isOpen: boolean;
  subOrderDetail?: ISubOrder;
  order: IOrder;
  onClose: () => void;
  onOpen?: (detail: ISubOrder) => void;
  onSave: () => void;
  onView: (asset: IAsset) => void;
  actionType?: OrderFlowType;
  focusedNoteIndex?: number | null;
}

const IndividualEmployee: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpen,
  subOrderDetail,
  order,
  onSave,
  onView,
  actionType,
  focusedNoteIndex,
}) => {
  const shouldUseReferenceSlideout =
    actionType === "onboarding" ||
    actionType === "storage_to_employee" ||
    actionType === "offboarding" ||
    (actionType === "device_refresh" &&
      Boolean(
        subOrderDetail?.employee_first_name ||
        subOrderDetail?.employee_last_name,
      ));

  const renderInstanceComponent = () => {
    if (actionType === "device_refresh") {
      return (
        <DeviceRefreshInstance
          subOrderDetail={subOrderDetail as ISubOrder}
          onView={onView}
          actionType={actionType}
          currency={order?.currency || ""}
          orderId={order?.id || ""}
          focusedNoteIndex={focusedNoteIndex}
        />
      );
    }

    if (actionType === "buy_to_storage") {
      return (
        <BuyToStorageInstance
          subOrderDetail={subOrderDetail as ISubOrder}
          currency={order?.currency || ""}
          focusedNoteIndex={focusedNoteIndex}
        />
      );
    }

    if (actionType === "offboarding") {
      return (
        <OffboardingInstance
          subOrderDetail={subOrderDetail as ISubOrder}
          currency={order?.currency || ""}
          orderId={order?.id || ""}
          onClose={onClose}
          onOpen={onOpen}
          focusedNoteIndex={focusedNoteIndex}
        />
      );
    }

    return (
      <OnboardingInstance
        subOrderDetail={subOrderDetail as ISubOrder}
        onView={onView}
        actionType={actionType}
        orderId={order?.id || ""}
        onClose={onClose}
        onOpen={onOpen}
        focusedNoteIndex={focusedNoteIndex}
      />
    );
  };

  return (
    <>
      {shouldUseReferenceSlideout ? (
        <ReferenceEmployeeSlideout
          isOpen={isOpen}
          onClose={onClose}
          subOrderDetail={subOrderDetail}
          order={order}
          orderId={order?.id || ""}
          orderNumber={order.order_number}
          currency={order?.currency || ""}
          actionType={actionType}
          onView={onView}
        />
      ) : (
        <DrawerRight
          isOpen={isOpen}
          onClose={onClose}
          onCancel={onClose}
          onSave={onSave}
          drawerTitle={order.order_number}
          drawerDescription=""
          hideSaveButton
          cancelText="Cancel"
          data-testid="individualemployee-drawerright"
        >
          {renderInstanceComponent()}
        </DrawerRight>
      )}
    </>
  );
};

export default IndividualEmployee;
