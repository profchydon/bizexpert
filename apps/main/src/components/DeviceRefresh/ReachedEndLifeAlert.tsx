import Image from "next/image";
import React, { FC } from "react";
import { Button } from "../ui/button";
import { warning_icon_red } from "@/assets/icons";
import CustomTooltip from "../CustomTooltip";
import {
  getRefreshBlockedMessage,
  isAssignedEquipmentStatus,
} from "./reachedEndLifeAlert.logic";

interface Props {
  onCorrect: () => void;
  status: string;
}

const ReachedEndLifeAlert: FC<Props> = ({ onCorrect, status }) => {
  const isDisabled = !isAssignedEquipmentStatus(status);
  const tooltipMessage = getRefreshBlockedMessage(status);

  const button = (
    <Button
      variant="outline"
      className="text-sm"
      onClick={onCorrect}
      disabled={isDisabled}
      data-testid="reachedendlifealert-button"
    >
      <span className="text-sm font-semibold">Correct</span>
    </Button>
  );

  return (
    <div className="flex flex-row justify-between items-center p-3 bg-gray-25 border-[1px] rounded-xl border-gray-300 shadow-md ">
      <div className="flex flex-row items-center gap-x-4">
        <Image
          src={warning_icon_red}
          alt="reached-end-life"
          width={48}
          height={48}
        />
        <p className="text-gray-700 font-semibold text-md">
          Your device is almost reaching end of life
        </p>
      </div>
      {isDisabled ? (
        <CustomTooltip
          content={<span className="text-white text-xs">{tooltipMessage}</span>}
        >
          <span className="inline-flex cursor-not-allowed">{button}</span>
        </CustomTooltip>
      ) : (
        button
      )}
    </div>
  );
};

export default ReachedEndLifeAlert;
