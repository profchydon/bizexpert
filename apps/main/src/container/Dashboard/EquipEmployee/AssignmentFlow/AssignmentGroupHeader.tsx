import type { ReactNode } from "react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { flagByCode } from "@/app/dashboard/NavBar/flagByCode";
import GroupProgressMeter from "./GroupProgressMeter";
import type { AssignmentSummary } from "./destinationSummary";

interface AssignmentGroupHeaderProps {
  countryCode: string;
  countryLabel: string;
  summary: AssignmentSummary;
  isSelectAllChecked: boolean;
  isSelectAllIndeterminate: boolean;
  onToggleSelectAll: () => void;
  actionSlot: ReactNode;
}

const AssignmentGroupHeader: React.FC<AssignmentGroupHeaderProps> = ({
  countryCode,
  countryLabel,
  summary,
  isSelectAllChecked,
  isSelectAllIndeterminate,
  onToggleSelectAll,
  actionSlot,
}) => {
  const Flag = flagByCode(countryCode);
  const done = summary.total - summary.unassigned;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-b border-secondary bg-secondary px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {Flag ? (
          <Flag className="size-5 rounded-full object-cover ring-1 ring-secondary" />
        ) : null}
        <span className="text-sm font-semibold text-primary">
          {countryLabel}
        </span>
        <span className="text-sm text-tertiary">
          {summary.total} {summary.total === 1 ? "device" : "devices"}
        </span>
        <span className="ml-1 flex items-center gap-2">
          <GroupProgressMeter summary={summary} className="w-20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-quaternary">
            {done} of {summary.total}
          </span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {actionSlot}
        <Checkbox
          size="sm"
          label="Select all"
          isSelected={isSelectAllChecked}
          isIndeterminate={isSelectAllIndeterminate}
          onChange={onToggleSelectAll}
          aria-label={`Select all devices in ${countryLabel}`}
          data-testid="assignmentgroupheader-checkbox"
        />
      </div>
    </div>
  );
};

export default AssignmentGroupHeader;
