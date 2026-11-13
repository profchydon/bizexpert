import type { ReactNode } from "react";
import { CheckCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import type { Grade } from "./types";

const TILE: Record<Grade, string> = {
  A: "bg-utility-success-50 text-utility-success-700 ring-utility-success-200",
  B: "bg-utility-blue-50 text-utility-blue-700 ring-utility-blue-200",
  C: "bg-utility-warning-50 text-utility-warning-700 ring-utility-warning-200",
  D: "bg-utility-error-50 text-utility-error-700 ring-utility-error-200",
};

interface Props {
  grade?: Grade;
  label: string;
  subtitle?: ReactNode;
  serialVerified?: boolean;
  summary?: string;
  /** Key facts about the check, shown as a divided row. Omit for a compact card. */
  meta?: { label: string; value: ReactNode }[];
}

export function CheckGradeHero({
  grade,
  label,
  subtitle,
  serialVerified,
  summary,
  meta,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-secondary bg-primary p-4">
      <div className="flex items-start gap-4">
        <span
          className={cx(
            "flex size-14 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold ring-1 ring-inset",
            grade ? TILE[grade] : "bg-secondary text-quaternary ring-secondary",
          )}
        >
          {grade ?? "-"}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-md font-semibold text-primary">
                {grade ? `Grade ${grade} · ${label}` : label}
              </span>
              {subtitle && (
                <span className="text-xs text-tertiary">{subtitle}</span>
              )}
            </div>
            {serialVerified && (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-utility-success-50 px-2 py-0.5 text-xs font-medium text-utility-success-700 ring-1 ring-utility-success-200 ring-inset">
                <CheckCircle className="size-3 shrink-0" /> Serial verified
              </span>
            )}
          </div>
        </div>
      </div>
      {meta && meta.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-secondary pt-3.5">
          {meta.map((entry) => (
            <div key={entry.label} className="flex min-w-0 flex-col gap-0.5">
              <dt className="text-xs text-quaternary">{entry.label}</dt>
              <dd className="truncate text-sm font-medium text-secondary">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {summary && (
        <p className="border-l-2 border-secondary pl-3 text-sm text-tertiary">
          {summary}
        </p>
      )}
    </div>
  );
}
