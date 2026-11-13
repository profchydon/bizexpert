import React, { FC } from "react";
import { ISubOrder } from "@/types/orders";
import { IAsset } from "@/types/assets";
import OnboardingInstance from "./OnboardingInstance";
import OffboardingInstance from "./OffboardingInstance";

interface Props {
  subOrderDetail?: ISubOrder;
  actionType?: string;
  currency: string;
  onView: (asset: IAsset) => void;
  orderId: string;
  focusedNoteIndex?: number | null;
}
const DeviceRefreshInstance: FC<Props> = ({
  subOrderDetail,
  onView,
  currency,
  actionType,
  orderId,
  focusedNoteIndex,
}) => {
  return (
    <>
      {subOrderDetail?.employee_first_name &&
      subOrderDetail?.employee_last_name ? (
        <OnboardingInstance
          subOrderDetail={subOrderDetail}
          onView={onView}
          actionType={actionType}
          orderId={orderId}
          focusedNoteIndex={focusedNoteIndex}
        />
      ) : (
        <OffboardingInstance
          subOrderDetail={subOrderDetail}
          currency={currency || ""}
          orderId={orderId}
          focusedNoteIndex={focusedNoteIndex}
        />
      )}
    </>
  );
};

export default DeviceRefreshInstance;
