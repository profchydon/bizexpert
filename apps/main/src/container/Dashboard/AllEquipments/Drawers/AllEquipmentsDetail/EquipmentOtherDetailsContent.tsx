"use client";

import { FileIcon } from "@untitledui/file-icons";
import { Download01 } from "@untitledui/icons";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import type { IEquipment } from "@/types/equipments";
import {
  EQUIPMENT_DETAIL_EMPTY_VALUE,
  equipmentDetailMissingValue,
} from "@/container/Dashboard/AllEquipments/ViewEquipment/equipmentDetailEmptyValue";
import {
  formatEquipmentDescription,
  parseEquipmentOtherDetailChips,
} from "./equipmentDetailFormat";
import { equipmentHashCodeHref } from "./equipmentHashCodeHref";

type FieldProps = {
  label: string;
  value: string;
};

const OtherDetailsField = ({ label, value }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-tertiary">{label}</span>
    <span className="text-sm font-medium text-primary">{value}</span>
  </div>
);

type Props = {
  equipment: IEquipment;
};

const EquipmentOtherDetailsContent = ({ equipment }: Props) => {
  const chips = parseEquipmentOtherDetailChips(equipment.other_details);
  const description =
    formatEquipmentDescription(equipment.description) ??
    EQUIPMENT_DETAIL_EMPTY_VALUE;
  const address = equipmentDetailMissingValue(equipment.assignee?.address);
  const hashCodeHref = equipmentHashCodeHref(equipment.hash_code);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <OtherDetailsField
          label="Model"
          value={equipmentDetailMissingValue(equipment.model)}
        />
        <OtherDetailsField
          label="Catalogue"
          value={equipmentDetailMissingValue(equipment.catalog?.name)}
        />
        <OtherDetailsField
          label="Year"
          value={equipmentDetailMissingValue(equipment.year)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-tertiary">Full address</span>
        <address className="text-sm font-medium text-primary not-italic">
          {address}
        </address>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-tertiary">Description</span>
        <p className="text-sm text-primary">{description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-tertiary">Other details</span>
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md px-2 py-0.5 text-xs font-medium text-secondary ring-1 ring-secondary ring-inset"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-primary">{EQUIPMENT_DETAIL_EMPTY_VALUE}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-tertiary">Hash file</span>
        {hashCodeHref ? (
          <div className="flex items-center gap-3 rounded-lg border border-secondary p-3">
            <FileIcon className="size-9 shrink-0" type="zip" theme="light" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-primary">
                Hashcode.zip
              </p>
            </div>
            <a
              href={hashCodeHref}
              download="Hashcode.zip"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <ButtonUtility
                size="sm"
                color="tertiary"
                icon={Download01}
                tooltip="Download"
                data-testid="equipmentotherdetails-button"
              />
            </a>
          </div>
        ) : (
          <p className="text-sm text-tertiary">No associated documents.</p>
        )}
      </div>
    </div>
  );
};

export default EquipmentOtherDetailsContent;
