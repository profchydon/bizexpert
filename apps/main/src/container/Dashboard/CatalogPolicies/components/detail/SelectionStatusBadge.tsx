import type { SelectionStatus } from "../../types";
import { cn } from "@/lib/utils";

const SELECTION_STATUS_CONFIG: Record<
  SelectionStatus,
  { label: string; className: string; dotClassName: string }
> = {
  PENDING: {
    label: "Pending",
    className: "border-warning-200 bg-warning-50 text-warning-700",
    dotClassName: "bg-warning-500",
  },
  APPROVED: {
    label: "Approved",
    className: "border-success-200 bg-success-50 text-success-700",
    dotClassName: "bg-success-500",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-error-200 bg-error-50 text-error-700",
    dotClassName: "bg-error-500",
  },
  CHANGES_REQUESTED: {
    label: "Changes requested",
    className: "border-gray-200 bg-gray-50 text-gray-700",
    dotClassName: "bg-gray-500",
  },
};

export function SelectionStatusBadge({
  status,
  size = "sm",
}: {
  status: SelectionStatus;
  size?: "sm" | "md";
}) {
  const config = SELECTION_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-normal",
        size === "sm"
          ? "h-5 gap-1 px-1.5 text-[11px] leading-4"
          : "h-6 gap-1.5 px-2 text-xs leading-5",
        config.className,
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" ? "size-1" : "size-1.5",
          config.dotClassName,
        )}
      />
      {config.label}
    </span>
  );
}
