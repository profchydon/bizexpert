"use client";

import { HelpCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { DisabledWithTooltip } from "@/components/base/tooltip/disabled-with-tooltip";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { IEquipment } from "@/types/equipments";
import React, { memo } from "react";
import { getImproveEquipmentScoreState } from "../../equipmentImproveScore";
import { ViewEquipmentDetailCard } from "../../ViewEquipmentDetailCard";
import { getEquipmentTypeIcon } from "../../equipmentTypeIcons";
import EquipmentScoreGauge from "./EquipmentScoreGauge";

interface Props {
  equipment: IEquipment;
  onImproveScore: () => void;
  isRefreshTrue: boolean;
}

const EquipmentAssetStatus: React.FC<Props> = ({
  equipment,
  onImproveScore,
  isRefreshTrue,
}) => {
  const score = equipment?.score || 0;
  const Icon = getEquipmentTypeIcon(equipment?.type as string);
  const { isDisabled, reason } = getImproveEquipmentScoreState(equipment);

  const improveButton = (
    <Button
      size="sm"
      color="secondary"
      className="self-start"
      onPress={onImproveScore}
      isDisabled={isDisabled}
      data-testid="equipmentassetstatus-button"
    >
      Improve equipment score
    </Button>
  );

  return (
    <ViewEquipmentDetailCard title="Asset status">
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <EquipmentScoreGauge
          value={score}
          icon={Icon}
          variant={isRefreshTrue ? "error" : "brand"}
        />
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold text-primary">
              The equipment score
            </h3>
            <Tooltip
              title="How it is calculated"
              description="Equipment score (0-100%): Reflects the completeness of this equipment's record. Key fields like assignment, location, purchase date, price, and configuration details are used in the calculation."
              placement="top"
            >
              <TooltipTrigger className="cursor-default">
                <HelpCircle className="size-4 text-fg-quaternary" />
              </TooltipTrigger>
            </Tooltip>
          </div>
          <p className="text-sm text-tertiary">
            Your equipment score reflects the completeness and accuracy of this
            equipment&apos;s information. A higher score helps ensure efficient
            management and tracking.
          </p>
          {isDisabled && reason ? (
            <DisabledWithTooltip
              isDisabled={isDisabled}
              reason={reason}
              triggerClassName="self-start"
            >
              {improveButton}
            </DisabledWithTooltip>
          ) : (
            improveButton
          )}
        </div>
      </div>
    </ViewEquipmentDetailCard>
  );
};

export default memo(EquipmentAssetStatus);
