"use client";

import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import {
  useEquipmentOfficeEntity,
  useEquipmentOfficeHref,
} from "../../useEquipmentOfficeHref";
import { IEquipment } from "@/types/equipments";
import formatAmount from "@/utils/formatAmount";
import { UNASSIGNED_ORDER_SUMMARY_KEY } from "@/utils/getInitials";
import { removeUserscore } from "@/utils/underScoreTransformer";
import dayjs from "dayjs";
import truncate from "lodash/truncate";
import React from "react";
import {
  ViewEquipmentDetailCard,
  ViewEquipmentDetailField,
  ViewEquipmentDetailGrid,
} from "../../ViewEquipmentDetailCard";
import {
  EQUIPMENT_DETAIL_EMPTY_VALUE,
  equipmentDetailMissingValue,
} from "../../equipmentDetailEmptyValue";
import { EquipmentItemWithSymbol } from "./EquipmentOverviewField";

const options = [
  { value: "MI", label: "Microsoft Intune" },
  { value: "ABM", label: "Apple Business Manager" },
];

interface Props {
  equipment: IEquipment;
  onEdit: () => void;
  onViewDetails: () => void;
}

const EquipmentOverview: React.FC<Props> = ({
  equipment,
  onEdit,
  onViewDetails,
}) => {
  const officeHref = useEquipmentOfficeHref(equipment?.office?.id);
  const officeEntity = useEquipmentOfficeEntity(equipment?.office?.id);
  const equipmentStatus = equipment?.status?.toLowerCase();
  const canEdit =
    equipmentStatus === "assigned" ||
    equipmentStatus === "in_storage" ||
    equipmentStatus === UNASSIGNED_ORDER_SUMMARY_KEY?.toLowerCase();
  const equipmentType = equipmentDetailMissingValue(equipment?.type as string);

  const actions = (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        color="secondary"
        onPress={onViewDetails}
        data-testid="equipmentoverview-button"
      >
        Other details
      </Button>
      {canEdit ? (
        <Button
          size="sm"
          color="primary"
          onPress={onEdit}
          data-testid="equipmentoverview-button-2"
        >
          Edit
        </Button>
      ) : null}
    </div>
  );

  return (
    <ViewEquipmentDetailCard title="Overview" action={actions}>
      <ViewEquipmentDetailGrid>
        <ViewEquipmentDetailField label="Location">
          <EquipmentItemWithSymbol
            location={{ country_code: equipment?.country_code as string }}
            value={equipmentDetailMissingValue(equipment?.country as string)}
          />
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Office">
          {equipment?.office?.name ? (
            <>
              {officeHref ? (
                <Link
                  href={officeHref}
                  className="block font-medium text-primary-700 hover:underline"
                  data-testid="equipmentoverview-office-link"
                >
                  {equipment.office.name}
                </Link>
              ) : (
                <span className="block">{equipment.office.name}</span>
              )}
              {equipment?.office_area?.name ? (
                <span className="block text-tertiary">
                  {equipment.office_area.name}
                </span>
              ) : null}
            </>
          ) : (
            EQUIPMENT_DETAIL_EMPTY_VALUE
          )}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Entity">
          {officeEntity ? (
            <Link
              href={officeEntity.href}
              className="block font-medium text-primary-700 hover:underline"
              data-testid="equipmentoverview-entity-link"
            >
              {officeEntity.name}
            </Link>
          ) : (
            EQUIPMENT_DETAIL_EMPTY_VALUE
          )}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Make">
          {equipmentDetailMissingValue(equipment?.make as string)}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Purchase price">
          {equipment?.purchase_price
            ? `${equipment?.currency?.symbol ?? ""}${formatAmount(equipment.purchase_price)}`
            : EQUIPMENT_DETAIL_EMPTY_VALUE}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Serial number">
          {equipment?.serial_number
            ? truncate(equipment.serial_number, { length: 20 })
            : EQUIPMENT_DETAIL_EMPTY_VALUE}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Equipment type">
          <span className="block lg:hidden xl:block">{equipmentType}</span>
          <span className="hidden lg:block xl:hidden">
            {equipment?.type
              ? truncate(equipment.type as string, { length: 10 })
              : EQUIPMENT_DETAIL_EMPTY_VALUE}
          </span>
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Purchase state">
          {equipment?.state
            ? removeUserscore(equipment.state as string)
            : EQUIPMENT_DETAIL_EMPTY_VALUE}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Purchase date">
          {equipment?.purchase_date
            ? dayjs(equipment.purchase_date).format("MMM DD, YYYY")
            : EQUIPMENT_DETAIL_EMPTY_VALUE}
        </ViewEquipmentDetailField>
        <ViewEquipmentDetailField label="Device configuration">
          {options.find((item) => {
            const itemValue = String(item.value ?? "").toLowerCase();
            const deviceValue = String(
              equipment?.device_setup ?? "",
            ).toLowerCase();
            return itemValue === deviceValue;
          })?.label ?? EQUIPMENT_DETAIL_EMPTY_VALUE}
        </ViewEquipmentDetailField>
      </ViewEquipmentDetailGrid>
    </ViewEquipmentDetailCard>
  );
};

export default EquipmentOverview;
