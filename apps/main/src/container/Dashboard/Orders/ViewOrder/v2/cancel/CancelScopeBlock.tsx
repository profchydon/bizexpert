"use client";

import { formatWithPrefix } from "@/utils/refund-preview";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  ScopeDeviceRow,
  ScopeGroupHead,
  ScopePersonRow,
  cancelledGroupLabel,
  excludedGroupLabel,
  plural,
} from "./ScopeRows";
import type { CancelScope } from "./buildCancelScope";

const people = (count: number) =>
  count === 1 ? "1 person" : `${count} people`;

export function CancelScopeBlock({
  scope,
  prefix,
  isOffboarding,
  lineSelection,
}: {
  scope: CancelScope;
  prefix: string;
  isOffboarding?: boolean;
  lineSelection?: {
    state: "all" | "some" | "none";
    onToggleLine: (lineId: string, selected: boolean) => void;
    onToggleAll: (selected: boolean) => void;
  };
}) {
  const single = scope.people.length === 1 ? scope.people[0] : null;
  const held = scope.exclusion.excludedDevices > 0;
  const openDevices =
    single?.devices.filter((device) => !device.excluded) ?? [];
  const cancelledDevices =
    single?.devices.filter(
      (device) => device.excluded && device.exclusionReason === "cancelled",
    ) ?? [];
  const heldDevices =
    single?.devices.filter(
      (device) => device.excluded && device.exclusionReason !== "cancelled",
    ) ?? [];
  const pricedRows = single
    ? openDevices.length + single.charges.length
    : scope.people.length;
  const selectableCount = single
    ? openDevices.length
    : scope.people.reduce(
        (sum, person) =>
          sum + person.devices.filter((device) => !device.excluded).length,
        0,
      );
  const toggleLine = lineSelection?.onToggleLine;

  return (
    <div className="overflow-hidden rounded-xl border border-secondary">
      {lineSelection && selectableCount > 1 && (
        <div className="flex items-center gap-2 border-b border-secondary bg-primary px-3 py-2">
          <Checkbox
            aria-label="Select all devices"
            isSelected={lineSelection.state === "all"}
            isIndeterminate={lineSelection.state === "some"}
            onChange={lineSelection.onToggleAll}
            size="sm"
            data-testid="cancelscopeblock-checkbox"
          />
          <span className="text-xs font-medium text-secondary">Select all</span>
        </div>
      )}
      {single ? (
        <>
          {held && (
            <ScopeGroupHead
              label="Can be cancelled"
              count={plural(openDevices.length, "device")}
            />
          )}
          <div className="flex flex-col bg-primary px-3 py-1.5">
            {openDevices.map((device, index) => (
              <ScopeDeviceRow
                key={device.id}
                device={device}
                prefix={prefix}
                forceNote
                isOffboarding={isOffboarding}
                index={index}
                onToggle={
                  toggleLine
                    ? (selected) => toggleLine(device.id, selected)
                    : undefined
                }
              />
            ))}
            {single.charges.map((charge) => (
              <ScopeDeviceRow
                key={charge.id}
                device={charge}
                prefix={prefix}
                forceNote
                isOffboarding={isOffboarding}
              />
            ))}
          </div>
          {cancelledDevices.length > 0 && (
            <>
              <ScopeGroupHead
                label={cancelledGroupLabel()}
                count={plural(cancelledDevices.length, "device")}
              />
              <div className="flex flex-col bg-primary px-3 py-1.5">
                {cancelledDevices.map((device, index) => (
                  <ScopeDeviceRow
                    key={device.id}
                    device={device}
                    prefix={prefix}
                    isOffboarding={isOffboarding}
                    index={openDevices.length + index}
                    onToggle={
                      toggleLine
                        ? (selected) => toggleLine(device.id, selected)
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}
          {heldDevices.length > 0 && (
            <>
              <ScopeGroupHead
                label={excludedGroupLabel(!!isOffboarding)}
                count={plural(heldDevices.length, "device")}
              />
              <div className="flex flex-col bg-primary px-3 py-1.5">
                {heldDevices.map((device, index) => (
                  <ScopeDeviceRow
                    key={device.id}
                    device={device}
                    prefix={prefix}
                    isOffboarding={isOffboarding}
                    index={openDevices.length + cancelledDevices.length + index}
                    onToggle={
                      toggleLine
                        ? (selected) => toggleLine(device.id, selected)
                        : undefined
                    }
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {held && (
            <ScopeGroupHead
              label="Can be cancelled"
              count={`${plural(scope.exclusion.devices, "device")} · ${people(scope.people.length)}`}
            />
          )}
          <div className="flex flex-col divide-y divide-border-secondary">
            {scope.people.map((person) => (
              <ScopePersonRow
                key={person.id}
                person={person}
                prefix={prefix}
                isOffboarding={isOffboarding}
                onToggleLine={toggleLine}
              />
            ))}
          </div>
        </>
      )}
      {pricedRows > 1 && (
        <div className="flex items-baseline justify-between gap-4 border-t border-secondary bg-secondary px-3 py-2">
          <span className="text-xs font-medium text-tertiary">
            {isOffboarding
              ? "Unused service charges"
              : `Cancelling ${plural(scope.exclusion.devices, "device")}`}
          </span>
          <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-primary">
            {formatWithPrefix(scope.total, prefix)}
          </span>
        </div>
      )}
    </div>
  );
}
