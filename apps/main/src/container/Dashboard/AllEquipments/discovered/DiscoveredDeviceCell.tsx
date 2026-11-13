"use client";

import { Table } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { STICKY_ACTION_CELL } from "./stickyActionColumn";
import { DISCOVERED_TOOLTIP } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/telemetryTooltips";
import type { DiscoveredDevice } from "./types";

export function DiscoveredDeviceCell({
  device,
  onReview,
  onDismiss,
}: {
  device: DiscoveredDevice;
  onReview: (device: DiscoveredDevice) => void;
  onDismiss: (device: DiscoveredDevice) => void;
}) {
  return (
    <Table.Row id={device.id} className="group">
      <Table.Cell>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-primary">
              {device.hostname}
            </span>
            <span className="text-sm text-tertiary">{device.model}</span>
          </div>
          <Tooltip title={DISCOVERED_TOOLTIP} placement="top">
            <TooltipTrigger className="cursor-default">
              <Badge color="brand" size="sm">
                Agent
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        </div>
      </Table.Cell>
      <Table.Cell>{device.serial}</Table.Cell>
      <Table.Cell>{device.os}</Table.Cell>
      <Table.Cell>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-primary">
            {device.employeeName}
          </span>
          <span className="text-sm text-tertiary">
            {device.employeeAccount}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell>{device.firstSeenLabel}</Table.Cell>
      <Table.Cell className={STICKY_ACTION_CELL}>
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            color="link-gray"
            onClick={() => onDismiss(device)}
            data-testid="discovereddevicecell-button"
          >
            Dismiss
          </Button>
          <Button
            size="sm"
            color="link-color"
            onClick={() => onReview(device)}
            data-testid="discovereddevicecell-button-2"
          >
            Review
          </Button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
