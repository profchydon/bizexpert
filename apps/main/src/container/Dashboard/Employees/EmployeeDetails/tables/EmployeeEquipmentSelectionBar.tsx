"use client";

import { Package, SwitchHorizontal01, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { Disposition } from "@/types/offboard";

type Props = {
  count: number;
  canAction?: boolean;
  pendingDisposition?: Disposition | null;
  onAction: (disposition: Disposition) => void;
  onClear: () => void;
};

const dispositionActions: {
  disposition: Disposition;
  label: string;
  icon: typeof SwitchHorizontal01;
}[] = [
  { disposition: "REASSIGN", label: "Reassign", icon: SwitchHorizontal01 },
  { disposition: "STORE", label: "Store", icon: Package },
  { disposition: "DISPOSE", label: "Dispose", icon: Trash01 },
];

const EmployeeEquipmentSelectionBar = ({
  count,
  canAction = true,
  pendingDisposition = null,
  onAction,
  onClear,
}: Props) => {
  const isBusy = Boolean(pendingDisposition);

  return (
    <div className="flex flex-col items-start gap-3 border-b border-secondary bg-secondary px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-primary">
          {count} device{count === 1 ? "" : "s"} selected
        </span>
        <button
          type="button"
          onClick={onClear}
          disabled={isBusy}
          className="text-sm font-medium text-tertiary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        {canAction
          ? dispositionActions.map(({ disposition, label, icon }) => (
              <Button
                key={disposition}
                size="sm"
                color="secondary"
                iconLeading={icon}
                isLoading={pendingDisposition === disposition}
                isDisabled={isBusy && pendingDisposition !== disposition}
                onPress={() => onAction(disposition)}
                data-testid="employeeequipmentselectionbar-button"
              >
                {label}
              </Button>
            ))
          : null}
      </div>
    </div>
  );
};

export default EmployeeEquipmentSelectionBar;
