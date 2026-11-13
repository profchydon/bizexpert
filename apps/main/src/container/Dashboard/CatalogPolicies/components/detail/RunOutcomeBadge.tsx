import type { RunOutcome } from "../../types";
import { formatRunOutcome } from "../../utilsRunHistory";
import { cn } from "@/lib/utils";

const OUTCOME_STYLES: Record<
  RunOutcome,
  { className: string; dotClassName?: string }
> = {
  MATCHED: {
    className: "border-success-200 bg-success-50 text-success-700",
  },
  SUPERSEDED: {
    className: "border-warning-200 bg-warning-50 text-warning-700",
  },
  FAILED: {
    className: "border-error-200 bg-error-50 text-error-700",
  },
  RESOLVED: {
    className: "border-success-200 bg-success-50 text-success-700",
  },
  POLICY_UNMATCHED: {
    className: "border-error-200 bg-error-50 text-error-700",
  },
};

export function RunOutcomeBadge({ outcome }: { outcome: RunOutcome }) {
  const style = OUTCOME_STYLES[outcome];
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full border px-2 text-[11px] font-normal leading-4",
        style.className,
      )}
    >
      {formatRunOutcome(outcome)}
    </span>
  );
}
