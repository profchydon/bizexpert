import { Avatar } from "@/components/base/avatar/avatar";
import { cn } from "@/lib/utils";
import { EQUIPMENT_DETAIL_EMPTY_VALUE } from "../../equipmentDetailEmptyValue";
import { IEquipment } from "@/types/equipments";
import { getInitials } from "@/utils/getInitials";
import { removeUserscore } from "@/utils/underScoreTransformer";
import truncate from "lodash/truncate";
import React from "react";
import {
  getEquipmentStatusBandClass,
  shouldShowEquipmentAssignee,
} from "../../equipmentAssetState";
import {
  viewEquipmentDeviceNameClass,
  viewEquipmentStatLabelClass,
  viewEquipmentStatValueClass,
  viewEquipmentStatusBandClass,
} from "../../viewEquipmentClasses";

export const EquipmentStatusBand = ({
  status,
}: {
  status: IEquipment["status"];
}) => (
  <p
    className={cn(
      viewEquipmentStatusBandClass,
      getEquipmentStatusBandClass(status),
    )}
  >
    {removeUserscore(status || "")}
  </p>
);

export const EquipmentAssigneeBlock = ({
  equipment,
}: {
  equipment: IEquipment;
}) => {
  if (!equipment?.assignee || !shouldShowEquipmentAssignee(equipment?.status)) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className={viewEquipmentStatLabelClass}>Assigned to</span>
      <div className="flex items-center gap-2">
        <Avatar
          size="xs"
          initials={
            getInitials(`${equipment.assignee.name || ""}`) ?? undefined
          }
          alt={equipment.assignee.name || "Assignee"}
        />
        <div className="min-w-0">
          <p className={viewEquipmentStatValueClass}>
            {equipment.assignee.name
              ? truncate(equipment.assignee.name, { length: 24 })
              : EQUIPMENT_DETAIL_EMPTY_VALUE}
          </p>
          {equipment.assignee.email ? (
            <p className="truncate text-xs text-tertiary">
              {truncate(equipment.assignee.email, { length: 28 })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const EquipmentDeviceHeading = ({
  name,
  equipment,
}: {
  name: string;
  equipment: IEquipment;
}) => (
  <div className="flex flex-col gap-2">
    <p className={viewEquipmentDeviceNameClass}>{name}</p>
    <EquipmentAssigneeBlock equipment={equipment} />
  </div>
);
