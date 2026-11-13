import { cx } from "@/utils/cx";
import type { ConditionRating } from "./types";

const RATING_DOT: Record<ConditionRating, string> = {
  Excellent: "bg-utility-success-500",
  Good: "bg-utility-blue-500",
  Fair: "bg-utility-warning-500",
  Poor: "bg-utility-error-500",
};

const RATING_TEXT: Record<ConditionRating, string> = {
  Excellent: "text-success-primary",
  Good: "text-secondary",
  Fair: "text-warning-primary",
  Poor: "text-error-primary",
};

interface Props {
  condition: { label: string; rating: ConditionRating }[];
}

export function CheckConditionGrid({ condition }: Props) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
      {condition.map((c) => (
        <div
          key={c.label}
          className="flex items-center justify-between gap-2 border-b border-secondary pb-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
        >
          <span className="text-sm text-tertiary">{c.label}</span>
          <span className="flex items-center gap-1.5">
            <span
              className={cx(
                "size-2 shrink-0 rounded-full",
                RATING_DOT[c.rating],
              )}
            />
            <span className={cx("text-sm font-medium", RATING_TEXT[c.rating])}>
              {c.rating}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
