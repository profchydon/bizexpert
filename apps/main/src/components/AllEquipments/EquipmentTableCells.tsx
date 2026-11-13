"use client";

import { Calendar, ShieldOff } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { SafeImage } from "@/components/SafeImage";
import { cn } from "@/lib/utils";
import { IEquipment } from "@/types/equipments";
import { formatRamStorage } from "@/utils/formatRamStorage";
import { removeUserscore } from "@/utils/underScoreTransformer";
import ReactCountryFlag from "react-country-flag";
import {
  deriveEquipmentDeviceStatus,
  EQUIPMENT_DEVICE_STATUS_DOT,
  EQUIPMENT_DEVICE_STATUS_LABEL,
  EQUIPMENT_DEVICE_STATUS_TOOLTIP,
  equipmentHasTelemetry,
} from "./equipmentTableDeviceStatus";
import {
  equipmentTableDeviceAvatarClass,
  equipmentTableDeviceAvatarImageClass,
  equipmentTableDeviceAvatarRingClass,
} from "./equipmentTableClasses";
import { getRefreshWarrantyPresentation } from "./equipmentTableStatusBadges";

type Row = Record<string, any>;

export const EquipmentTableNameCell = ({
  row,
  onEquipmentNameClick,
}: {
  row: Row;
  onEquipmentNameClick?: (item: Row) => void;
}) => (
  <div className="flex items-center gap-3">
    <div className={equipmentTableDeviceAvatarClass} title={row?.title}>
      <SafeImage
        src={row?.image_url}
        alt={row?.title}
        width={28}
        height={28}
        className={equipmentTableDeviceAvatarImageClass}
      />
      <div className={equipmentTableDeviceAvatarRingClass} />
    </div>
    <div className="flex min-w-0 flex-col items-start">
      {onEquipmentNameClick ? (
        <button
          type="button"
          className="truncate rounded text-left text-sm font-medium text-primary outline-focus-ring hover:underline focus-visible:outline-2 focus-visible:-outline-offset-2"
          title={row?.title}
          onClick={() => onEquipmentNameClick(row)}
          data-testid="allequipmentstablecolumn-equipment-name"
        >
          {row?.title}
        </button>
      ) : (
        <p
          className="truncate text-sm font-medium text-primary"
          title={row?.title}
        >
          {row?.title}
        </p>
      )}
      <p className="text-sm text-tertiary">
        {row?.source ? removeUserscore(row.source) : "External"}
      </p>
    </div>
  </div>
);

export const EquipmentTableAssigneeCell = ({ row }: { row: Row }) => {
  const assigneeName = row?.assignee?.name;
  return (
    <span
      className={cn(
        "truncate text-sm",
        assigneeName ? "font-medium text-primary" : "text-tertiary",
      )}
    >
      {assigneeName || "Unassigned"}
    </span>
  );
};

export const EquipmentTableSerialCell = ({ row }: { row: Row }) => (
  <p className="truncate text-sm text-primary">{row?.serial_number || "—"}</p>
);

export const EquipmentTableRamCell = ({ row }: { row: Row }) => {
  const value = formatRamStorage(row?.specs);
  return (
    <span className="text-sm text-tertiary">
      {value === "NA" ? "—" : value}
    </span>
  );
};

export const EquipmentTableLocationCell = ({ row }: { row: Row }) => {
  if (!row?.country_code) {
    return <span className="text-sm text-quaternary">—</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <ReactCountryFlag
        countryCode={row.country_code}
        svg
        style={{ width: 20, height: 20, borderRadius: "9999px" }}
      />
      <span className="text-sm text-primary">{row?.country || ""}</span>
    </div>
  );
};

export const EquipmentTableDeviceStatusCell = ({ row }: { row: Row }) => {
  if (!equipmentHasTelemetry(row?.type)) {
    return <span className="text-sm text-quaternary">—</span>;
  }

  const status = deriveEquipmentDeviceStatus(row?.status);

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Tooltip title={EQUIPMENT_DEVICE_STATUS_TOOLTIP[status]} placement="top">
        <TooltipTrigger className="flex cursor-default items-center gap-1.5">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              EQUIPMENT_DEVICE_STATUS_DOT[status],
            )}
          />
          <span className="text-sm font-medium text-primary">
            {EQUIPMENT_DEVICE_STATUS_LABEL[status]}
          </span>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
};

export const EquipmentTableWarrantyCell = ({ row }: { row: Row }) => {
  const presentation = getRefreshWarrantyPresentation(
    row?.refresh_details?.refresh_status,
    row?.refresh_details?.months_till_due,
  );

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Tooltip
        title={presentation.tooltip}
        description={presentation.description}
        placement="top"
      >
        <TooltipTrigger className="cursor-default">
          <Badge color={presentation.color} size="sm">
            {presentation.label}
          </Badge>
        </TooltipTrigger>
      </Tooltip>
      {presentation.caption ? (
        <span
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap text-sm",
            presentation.captionTone,
          )}
        >
          {presentation.captionIcon === "calendar" ? (
            <Calendar className="size-3.5 shrink-0 text-fg-quaternary" />
          ) : (
            <ShieldOff className="size-3.5 shrink-0 text-fg-quaternary" />
          )}
          {presentation.caption}
        </span>
      ) : null}
    </div>
  );
};
