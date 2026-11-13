"use client";

import React, { useState } from "react";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BulkActionMenu from "./BulkActionMenu";
import ReassignTargetPicker from "./ReassignTargetPicker";
import {
  DEFAULT_DISPOSITION,
  DEFAULT_WIPE_TYPE,
  DISPOSITION_OPTIONS,
  getBulkWipeOptions,
  resolveUniformValue,
  type Disposition,
  type ReassignTarget,
  type WipeType,
} from "./offboardPricing";

interface Props {
  selectedCount: number;
  selectedDispositions: Disposition[];
  selectedWipes: WipeType[];
  sourceCountry?: string;
  excludeIds: string[];
  onSetDisposition: (value: Disposition) => void;
  onSetWipe: (value: WipeType) => void;
  onReassign: (target: ReassignTarget) => void;
  onClear: () => void;
}

const DeviceBulkActionsBar: React.FC<Props> = ({
  selectedCount,
  selectedDispositions,
  selectedWipes,
  sourceCountry,
  excludeIds,
  onSetDisposition,
  onSetWipe,
  onReassign,
  onClear,
}) => {
  const [bulkDisposition, setBulkDisposition] =
    useState<Disposition>(DEFAULT_DISPOSITION);
  const [bulkWipe, setBulkWipe] = useState<WipeType>(DEFAULT_WIPE_TYPE);

  const wipeOptions = getBulkWipeOptions(selectedDispositions);
  const uniformDisposition = resolveUniformValue(selectedDispositions);
  const dispositionValue = uniformDisposition ?? bulkDisposition;
  const uniformWipe = resolveUniformValue(selectedWipes);
  const currentWipe =
    uniformWipe && wipeOptions.some((option) => option.value === uniformWipe)
      ? uniformWipe
      : wipeOptions.some((option) => option.value === bulkWipe)
        ? bulkWipe
        : wipeOptions[0]?.value;

  return (
    <div className="flex flex-col gap-3 bg-primary-50 px-6 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-gray-900">
          Assigned devices
        </h3>
        <span className="inline-flex items-center rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-primary-700">
          {selectedCount} selected
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <BulkActionMenu
          label="Set disposition"
          value={dispositionValue}
          options={DISPOSITION_OPTIONS}
          onSelect={(next) => {
            setBulkDisposition(next);
            onSetDisposition(next);
          }}
          testId="devicebulkactionsbar-select"
        />

        <BulkActionMenu
          label="Set wipe"
          value={currentWipe}
          options={wipeOptions}
          disabled={wipeOptions.length === 0}
          onSelect={(next) => {
            setBulkWipe(next);
            onSetWipe(next);
          }}
          testId="devicebulkactionsbar-select-2"
        />

        {dispositionValue === "REASSIGN" && (
          <ReassignTargetPicker
            sourceCountry={sourceCountry}
            excludeIds={excludeIds}
            onSelect={onReassign}
            renderTrigger={() => (
              <Button
                type="button"
                variant="outline"
                className="h-9 gap-2 bg-white px-4 text-sm font-semibold text-gray-700"
                data-testid="devicebulkactionsbar-button"
              >
                <User className="h-4 w-4 text-gray-500" />
                Reassign to...
              </Button>
            )}
          />
        )}

        <Button
          type="button"
          variant="ghost"
          className="h-9 gap-1 px-3 text-sm font-semibold text-gray-600 hover:bg-white/60"
          onClick={onClear}
          data-testid="devicebulkactionsbar-button-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default DeviceBulkActionsBar;
