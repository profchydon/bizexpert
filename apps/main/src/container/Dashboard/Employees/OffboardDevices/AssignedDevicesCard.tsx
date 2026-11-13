import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import AssignedDeviceRow, {
  OFFBOARD_COLUMN_TEMPLATE,
} from "./AssignedDeviceRow";
import DeviceBulkActionsBar from "./DeviceBulkActionsBar";
import type {
  DeviceLine,
  Disposition,
  ReassignTarget,
  WipeType,
} from "./offboardPricing";

const HEAD_LABELS = ["Device", "Disposition", "Wipe", "Service fee"];

interface Props {
  lines: DeviceLine[];
  selectedIds: string[];
  sourceCountry?: string;
  excludeIds: string[];
  employeeId: string;
  onFee: (lineId: string, fee: number) => void;
  onToggleSelect: (lineId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDisposition: (lineId: string, value: Disposition) => void;
  onWipe: (lineId: string, value: WipeType) => void;
  onReassign: (lineId: string, target: ReassignTarget) => void;
  onDispositionMany: (lineIds: string[], value: Disposition) => void;
  onWipeMany: (lineIds: string[], value: WipeType) => void;
  onReassignMany: (lineIds: string[], target: ReassignTarget) => void;
}

const AssignedDevicesCard: React.FC<Props> = ({
  lines,
  selectedIds,
  sourceCountry,
  excludeIds,
  employeeId,
  onFee,
  onToggleSelect,
  onSelectAll,
  onDisposition,
  onWipe,
  onReassign,
  onDispositionMany,
  onWipeMany,
  onReassignMany,
}) => {
  const lineIdSet = new Set(lines.map((line) => line.id));
  const selected = selectedIds.filter((id) => lineIdSet.has(id));
  const selectedSet = new Set(selected);
  const selectedCount = selected.length;
  const selectedDispositions = lines
    .filter((line) => selectedSet.has(line.id))
    .map((line) => line.disposition);
  const selectedWipes = lines
    .filter((line) => selectedSet.has(line.id))
    .map((line) => line.wipeType);
  const allSelected = lines.length > 0 && selectedCount === lines.length;
  const headerChecked = allSelected
    ? true
    : selectedCount > 0
      ? "indeterminate"
      : false;

  return (
    <Card className="overflow-hidden">
      {selectedCount > 0 ? (
        <DeviceBulkActionsBar
          selectedCount={selectedCount}
          selectedDispositions={selectedDispositions}
          selectedWipes={selectedWipes}
          sourceCountry={sourceCountry}
          excludeIds={excludeIds}
          onSetDisposition={(value) => onDispositionMany(selected, value)}
          onSetWipe={(value) => onWipeMany(selected, value)}
          onReassign={(target) => onReassignMany(selected, target)}
          onClear={() => onSelectAll(false)}
        />
      ) : (
        <div className="flex items-center gap-2 px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900">
            Assigned devices
          </h3>
          <Badge variant="blue">{lines.length}</Badge>
        </div>
      )}

      {lines.length === 0 ? (
        <div className="border-t border-gray-100 px-6 py-10 text-center text-sm text-gray-500">
          This employee has no assigned devices to off-board.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[940px]">
            <div
              className="grid items-center gap-x-6 border-y border-gray-100 bg-gray-50 px-6 py-2.5"
              style={{ gridTemplateColumns: OFFBOARD_COLUMN_TEMPLATE }}
            >
              <Checkbox
                checked={headerChecked}
                onCheckedChange={(value) => onSelectAll(value === true)}
                aria-label="Select all devices"
                className="h-5 w-5 shadow-none"
                data-testid="assigneddevicescard-checkbox"
              />
              {HEAD_LABELS.map((label) => (
                <div
                  key={label}
                  className="text-xs font-semibold text-gray-500"
                >
                  {label}
                </div>
              ))}
            </div>
            {lines.map((line) => (
              <AssignedDeviceRow
                key={line.id}
                line={line}
                employeeId={employeeId}
                sourceCountry={sourceCountry}
                excludeIds={excludeIds}
                selected={selectedSet.has(line.id)}
                onFee={onFee}
                onSelectChange={onToggleSelect}
                onDisposition={onDisposition}
                onWipe={onWipe}
                onReassign={onReassign}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default AssignedDevicesCard;
