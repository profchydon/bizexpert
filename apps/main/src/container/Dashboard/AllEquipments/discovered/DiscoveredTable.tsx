"use client";

import { useState } from "react";
import { XClose } from "@untitledui/icons";
import type { Selection, SortDescriptor } from "react-aria-components";
import { BulkActionBar } from "@/components/application/table/bulk-action-bar";
import { Table, TableCard } from "@/components/application/table/table";
import { STICKY_ACTION_HEAD } from "./stickyActionColumn";
import type { Ownership } from "@/container/Dashboard/AllEquipments/ViewEquipment/telemetry/types";
import type { DiscoveredDevice } from "./types";
import { useDiscoveredActions, usePendingDiscovered } from "./store";
import { ClassifyDeviceModal } from "./ClassifyDeviceModal";
import { DiscoveredDeviceCell } from "./DiscoveredDeviceCell";
import { DiscoveredEmpty } from "./DiscoveredEmpty";
import { DismissDeviceModal } from "./DismissDeviceModal";
import { sortDiscovered } from "./sortDiscovered";

// The review queue's home (Device Fleet, Discovered tab). Approve classifies ownership
// and moves the device into Equipment; Dismiss takes it out of the queue.
export function DiscoveredTable({
  onToast,
}: {
  onToast: (message: string) => void;
}) {
  const pending = usePendingDiscovered();
  const { approveDiscovered, dismissDiscovered } = useDiscoveredActions();
  const [sort, setSort] = useState<SortDescriptor>({
    column: "firstSeen",
    direction: "descending",
  });
  const [selection, setSelection] = useState<Selection>(new Set());
  const [reviewing, setReviewing] = useState<DiscoveredDevice | null>(null);
  const [dismissing, setDismissing] = useState<DiscoveredDevice | null>(null);

  const selectedIds =
    selection === "all"
      ? pending.map((d) => d.id)
      : Array.from(selection as Set<React.Key>).map(String);

  async function handleApprove(device: DiscoveredDevice, ownership: Ownership) {
    await approveDiscovered(device, ownership);
    setReviewing(null);
    setSelection(new Set());
    onToast(`${device.model} added to your Device Fleet`);
  }

  async function handleDismiss(device: DiscoveredDevice) {
    await dismissDiscovered(device);
    setDismissing(null);
    setSelection(new Set());
    onToast(`${device.hostname} dismissed`);
  }

  async function handleBulkDismiss() {
    await Promise.all(
      selectedIds.map((id) => {
        const device = pending.find((item) => item.id === id);
        return device ? dismissDiscovered(device) : Promise.resolve();
      }),
    );
    setSelection(new Set());
    onToast(
      `${selectedIds.length} ${selectedIds.length === 1 ? "device" : "devices"} dismissed`,
    );
  }

  if (pending.length === 0) return <DiscoveredEmpty />;

  return (
    <div className="mt-4">
      <TableCard.Root>
        {selectedIds.length > 0 && (
          <BulkActionBar
            count={selectedIds.length}
            note="approving stays per device, so each one gets the right owner"
            actions={[
              {
                label: "Dismiss selected",
                icon: XClose,
                color: "secondary",
                onClick: handleBulkDismiss,
              },
            ]}
            onClear={() => setSelection(new Set())}
          />
        )}
        <div className="overflow-x-auto">
          <Table
            aria-label="Devices discovered by the telemetry agent"
            sortDescriptor={sort}
            onSortChange={setSort}
            selectionMode="multiple"
            selectedKeys={selection}
            onSelectionChange={setSelection}
            className="min-w-[900px]"
          >
            <Table.Header>
              <Table.Head
                id="device"
                label="Device"
                tooltip="Hostname and model the agent reported"
                isRowHeader
                allowsSorting
              />
              <Table.Head
                id="serial"
                label="Serial"
                tooltip="Serial number read from the hardware"
                allowsSorting
              />
              <Table.Head
                id="os"
                label="OS"
                tooltip="Operating system and version"
                allowsSorting
              />
              <Table.Head
                id="seenOn"
                label="Seen on"
                tooltip="The account signed in when the agent reported"
                allowsSorting
              />
              <Table.Head
                id="firstSeen"
                label="First seen"
                tooltip="When the agent first reported this device"
                allowsSorting
              />
              <Table.Head
                id="actions"
                className={`${STICKY_ACTION_HEAD} max-w-20`}
              />
            </Table.Header>
            <Table.Body items={sortDiscovered(pending, sort)}>
              {(device) => (
                <DiscoveredDeviceCell
                  key={device.id}
                  device={device}
                  onReview={setReviewing}
                  onDismiss={setDismissing}
                />
              )}
            </Table.Body>
          </Table>
        </div>
      </TableCard.Root>
      <ClassifyDeviceModal
        device={reviewing}
        onClose={() => setReviewing(null)}
        onApprove={handleApprove}
      />
      <DismissDeviceModal
        device={dismissing}
        onClose={() => setDismissing(null)}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
