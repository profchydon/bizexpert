"use client";

import { ChevronRight } from "@untitledui/icons";
import { Table } from "@/components/application/table/table";
import type { StorageOrder } from "../types/storage";
import { formatDate } from "../utils/deriveDevice";
import { CountryFlag } from "./CountryFlag";
import { DeviceAvatar } from "./DeviceAvatar";
import {
  MovementBadge,
  OrderTypeBadge,
  RequestStatusBadge,
} from "./StorageBadges";

interface Props {
  order: StorageOrder;
  onOpen: () => void;
}

export function StorageOrderRow({ order, onOpen }: Props) {
  const orderLabel = order.orderNumber ?? order.id;

  return (
    <Table.Row id={order.id} onAction={onOpen} className="cursor-pointer">
      <Table.Cell className="font-medium text-primary">{orderLabel}</Table.Cell>
      <Table.Cell className="text-primary">
        <div className="flex items-center gap-2.5">
          <DeviceAvatar
            image={order.image}
            assetType={order.assetType ?? ""}
            name={order.deviceName}
            size="sm"
          />
          <div className="flex flex-col">
            <span className="font-medium">{order.deviceName}</span>
            <span className="text-xs text-tertiary">
              {order.serialNumber || "—"}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        <OrderTypeBadge
          kind={order.kind}
          entrySource={order.entrySource}
          flowLabel={order.flowLabel}
        />
      </Table.Cell>
      <Table.Cell>
        {order.directionLabel ? (
          <MovementBadge
            direction={order.direction}
            directionLabel={order.directionLabel}
          />
        ) : (
          <span className="text-sm text-quaternary">—</span>
        )}
      </Table.Cell>
      <Table.Cell>
        <span className="flex items-center gap-2">
          <CountryFlag
            country={order.country}
            countryCode={order.countryCode}
          />
          {order.country}
        </span>
      </Table.Cell>
      <Table.Cell className="text-tertiary">
        {formatDate(order.createdAt)}
      </Table.Cell>
      <Table.Cell>
        <RequestStatusBadge status={order.status} label={order.statusLabel} />
      </Table.Cell>
      <Table.Cell>
        <ChevronRight className="size-4 text-fg-quaternary" aria-hidden />
      </Table.Cell>
    </Table.Row>
  );
}
