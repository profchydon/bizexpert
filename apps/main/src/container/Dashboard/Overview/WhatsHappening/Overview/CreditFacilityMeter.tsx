import type { ReactNode } from "react";
import { formatSpendingAmount } from "../../dashboardSpending";

export function CreditFacilityMeter({
  limit,
  available,
  badge,
  currencySymbol,
}: {
  limit: number;
  available: number;
  badge?: ReactNode;
  currencySymbol: string;
}) {
  const used = Math.max(0, limit - available);
  const usedPct =
    limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <div className="flex flex-col gap-2 px-4 pt-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-tertiary">
          Credit available
        </span>
        {badge}
      </div>
      <span className="text-2xl leading-8 font-semibold text-primary tabular-nums">
        {formatSpendingAmount(available, currencySymbol)}
      </span>
      <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-quaternary">
        <div
          className="h-full rounded-full bg-brand-solid"
          style={{ width: `${usedPct}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-tertiary tabular-nums">
        <span>{usedPct}% used</span>
        <span>{formatSpendingAmount(limit, currencySymbol)} limit</span>
      </div>
    </div>
  );
}
