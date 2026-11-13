import { cn } from "@/lib/utils";
import type { AssignmentSummary } from "./destinationSummary";

interface GroupProgressMeterProps {
  summary: AssignmentSummary;
  className?: string;
}

const GroupProgressMeter: React.FC<GroupProgressMeterProps> = ({
  summary,
  className = "w-28",
}) => {
  if (summary.total === 0) return null;
  const done = summary.total - summary.unassigned;

  return (
    <span
      className={cn(
        "flex h-1.5 overflow-hidden rounded-full bg-quaternary",
        className,
      )}
      aria-hidden="true"
    >
      <i
        className="block h-full rounded-full bg-utility-gray-500 transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${(done / summary.total) * 100}%` }}
      />
    </span>
  );
};

export default GroupProgressMeter;
