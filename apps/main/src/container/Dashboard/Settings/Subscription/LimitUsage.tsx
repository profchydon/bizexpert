"use client";

import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import type { LimitUsageRow } from "./limitUsageRows";

export function LimitUsage({
  rows,
  onUpgrade,
}: {
  rows: LimitUsageRow[];
  onUpgrade: () => void;
}) {
  if (!rows?.length) return null;
  const blocked = rows.some((row) => row.atLimit);
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold tracking-wide text-tertiary uppercase">
        Usage
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <li
            key={row.code}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-secondary">{row.name}</span>
            <span
              className={cx(
                "text-sm font-medium text-primary tabular-nums",
                row.softWarning && "text-warning-primary",
              )}
            >
              {row.label}
            </span>
          </li>
        ))}
      </ul>
      {blocked && (
        <Button
          className="mt-3"
          color="secondary"
          size="sm"
          onClick={onUpgrade}
          data-testid="limitusage-button"
        >
          See plans
        </Button>
      )}
    </div>
  );
}
