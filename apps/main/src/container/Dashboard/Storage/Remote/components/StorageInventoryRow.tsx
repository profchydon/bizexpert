import { Table } from "@/components/application/table/table";
import { STICKY_ACTION_CELL } from "../utils/stickyActionColumn";
import type { RequestKind, StoredDevice } from "../types/storage";
import { daysInStorage, formatDate } from "../utils/deriveDevice";
import { CountryFlag } from "./CountryFlag";
import { DeviceAvatar } from "./DeviceAvatar";
import { CheckFreshness } from "./CheckFreshness";
import {
  GradeBadge,
  SourceBadge,
  StatusBadge,
  WipeBadge,
} from "./StorageBadges";
import { StorageRowActions } from "./StorageRowActions";

interface RowProps {
  device: StoredDevice;
  onOpen: (d: StoredDevice) => void;
  onAction: (kind: RequestKind, device: StoredDevice) => void;
}

export function StorageInventoryRow({ device, onOpen, onAction }: RowProps) {
  return (
    <Table.Row id={device.id} className="group">
      <Table.Cell className="font-medium text-primary">
        <div className="flex items-center gap-3">
          <DeviceAvatar
            image={device.image}
            assetType={device.assetType}
            name={device.deviceName}
            size="md"
          />
          <div className="flex flex-col">
            <span>{device.deviceName}</span>
            <span className="text-sm font-normal text-tertiary">
              {device.assetType}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell className="text-sm text-tertiary">
        {device.serialNumber}
      </Table.Cell>
      <Table.Cell>
        <div className="flex items-center gap-2">
          <CountryFlag
            country={device.country}
            countryCode={device.countryCode}
          />
          <span className="text-secondary">{device.country}</span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <span className="text-secondary">{device.entityName || "—"}</span>
      </Table.Cell>
      <Table.Cell>
        {device.grade ? (
          <div className="flex flex-col items-start gap-1">
            <GradeBadge grade={device.grade} label={device.gradeLabel} />
            <CheckFreshness device={device} />
          </div>
        ) : (
          <span className="text-sm text-quaternary">—</span>
        )}
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="text-secondary">{formatDate(device.entryDate)}</span>
          <span className="text-sm text-quaternary">
            {daysInStorage(device)}d in storage
          </span>
        </div>
      </Table.Cell>
      <Table.Cell>
        <SourceBadge source={device.entrySource} label={device.sourceLabel} />
      </Table.Cell>
      <Table.Cell>
        <StatusBadge status={device.status} label={device.storageStatusLabel} />
      </Table.Cell>
      <Table.Cell>
        {device.wipeStatus ? (
          <WipeBadge status={device.wipeStatus} label={device.wipeLabel} />
        ) : (
          <span className="text-sm text-quaternary">—</span>
        )}
      </Table.Cell>
      <Table.Cell className={STICKY_ACTION_CELL}>
        <div className="flex justify-end">
          <StorageRowActions
            device={device}
            onOpen={onOpen}
            onAction={onAction}
          />
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
