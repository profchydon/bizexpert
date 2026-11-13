import {
  Download01,
  PackageCheck,
  Trash02,
  Truck01,
  XClose,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import type { DeviceActionKind } from "../data/deviceActions";

interface Props {
  count: number;
  actionableCount: number;
  kinds: DeviceActionKind[];
  onAction: (kind: DeviceActionKind) => void;
  onExport: () => void;
  exportLoading?: boolean;
  onClear: () => void;
}

export function StorageBulkBar({
  count,
  actionableCount,
  kinds,
  onAction,
  onExport,
  exportLoading,
  onClear,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary bg-secondary px-5 py-2.5">
      <span className="text-sm font-medium text-secondary">
        {count} selected
        {actionableCount > 0 && actionableCount < count
          ? ` · ${actionableCount} actionable`
          : ""}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        {kinds.includes("deployment") && (
          <Button
            size="sm"
            color="secondary"
            iconLeading={Truck01}
            onClick={() => onAction("deployment")}
            data-testid="storagebulkbar-button"
          >
            Deploy
          </Button>
        )}
        {kinds.includes("device_check") && (
          <Button
            size="sm"
            color="secondary"
            iconLeading={PackageCheck}
            onClick={() => onAction("device_check")}
            data-testid="storagebulkbar-button-2"
          >
            Check
          </Button>
        )}
        {kinds.includes("disposal") && (
          <Button
            size="sm"
            color="secondary-destructive"
            iconLeading={Trash02}
            onClick={() => onAction("disposal")}
            data-testid="storagebulkbar-button-3"
          >
            Dispose
          </Button>
        )}
        <Button
          size="sm"
          color="secondary"
          iconLeading={Download01}
          isLoading={exportLoading}
          onClick={onExport}
          data-testid="storagebulkbar-button-4"
        >
          Export
        </Button>
        <Button
          size="sm"
          color="link-gray"
          iconLeading={XClose}
          onClick={onClear}
          data-testid="storagebulkbar-button-5"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
