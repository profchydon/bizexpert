"use client";

import ReactCountryFlag from "react-country-flag";
import dayjs from "dayjs";
import { Badge } from "@/components/base/badges/badges";
import { Table } from "@/components/application/table/table";
import { SafeImage } from "@/components/SafeImage";
import { IEquipment } from "@/types/equipments";
import type { Disposition } from "@/types/offboard";
import formatAmount from "@/utils/formatAmount";
import { formatRamStorage } from "@/utils/formatRamStorage";
import { removeUserscore } from "@/utils/underScoreTransformer";
import {
  EquipmentAssetStatusBadge,
  RefreshStatusBadge,
} from "./employeeDetailBadges";
import EmployeeEquipmentRowActions from "./EmployeeEquipmentRowActions";
import {
  getEquipmentSelectionDisabledReason,
  isDispositionEquipment,
} from "../employeeEquipmentDisposition";
import { STICKY_ACTION_CELL } from "./stickyActionColumn";

type Props = {
  row: IEquipment;
  onEquipmentClick: (equipmentId: string) => void;
  onBulkDisposition: (disposition: Disposition, deviceIds: string[]) => void;
  pendingDisposition?: Disposition | null;
};

const EmployeeEquipmentTableRow = ({
  row,
  onEquipmentClick,
  onBulkDisposition,
  pendingDisposition = null,
}: Props) => {
  const deviceId = String(row.id);
  const canDispose = isDispositionEquipment(row);

  return (
    <Table.Row
      id={row.id!}
      className="group"
      selectionDisabledReason={getEquipmentSelectionDisabledReason(row)}
    >
      <Table.Cell>
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={() => row.id && onEquipmentClick(row.id)}
        >
          <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
            <SafeImage
              src={row.image_url}
              alt={row.title}
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </span>
          <span className="max-w-[28ch] truncate font-medium text-primary">
            {row.title}
          </span>
        </button>
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col gap-0.5">
          <span className="max-w-[12ch] truncate font-semibold text-primary">
            {row.serial_number || "---------------"}
          </span>
          <span className="text-sm text-tertiary">
            {row.source ? removeUserscore(row.source) : "---------------"}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell>{formatRamStorage(row.specs)}</Table.Cell>
      <Table.Cell>
        {row.purchase_date ? (
          dayjs(row.purchase_date).format("MMM DD, YYYY")
        ) : (
          <Badge color="error" size="sm" type="pill-color">
            Not available
          </Badge>
        )}
      </Table.Cell>
      <Table.Cell className="tabular-nums text-secondary">
        {row.currency?.symbol ?? ""}
        {formatAmount(row.purchase_price)}
      </Table.Cell>
      <Table.Cell>
        {row.country_code ? (
          <div className="flex items-center gap-2">
            <ReactCountryFlag
              countryCode={row.country_code}
              svg
              style={{ width: 20, height: 20 }}
            />
            <span>{row.country}</span>
          </div>
        ) : (
          <Badge color="error" size="sm" type="pill-color">
            Not available
          </Badge>
        )}
      </Table.Cell>
      <Table.Cell>
        <EquipmentAssetStatusBadge status={row.status} />
      </Table.Cell>
      <Table.Cell>
        <RefreshStatusBadge status={row.refresh_details?.refresh_status} />
      </Table.Cell>
      <Table.Cell className={STICKY_ACTION_CELL}>
        {canDispose ? (
          <EmployeeEquipmentRowActions
            pendingDisposition={pendingDisposition}
            onReassign={() => onBulkDisposition("REASSIGN", [deviceId])}
            onStore={() => onBulkDisposition("STORE", [deviceId])}
            onDispose={() => onBulkDisposition("DISPOSE", [deviceId])}
          />
        ) : null}
      </Table.Cell>
    </Table.Row>
  );
};

export default EmployeeEquipmentTableRow;
