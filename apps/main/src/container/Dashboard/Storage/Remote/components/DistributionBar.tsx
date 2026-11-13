import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import {
  distributionBarLegendClass,
  distributionBarLegendCountClass,
  distributionBarLegendItemClass,
  distributionBarLegendLabelClass,
  distributionBarSegmentClass,
  distributionBarTrackClass,
} from "./distributionBarClasses";

export interface BarSegment {
  key: string;
  label: string;
  count: number;
  colorClass: string;
  tooltip: string;
}

interface Props {
  segments: BarSegment[];
  total: number;
  onSelect: (key: string) => void;
}

export function DistributionBar({ segments, total, onSelect }: Props) {
  const denom = total || 1;
  const noun = total === 1 ? "device" : "devices";

  return (
    <div className="flex flex-col gap-3">
      <div className={distributionBarTrackClass}>
        {segments.map((s) => {
          const pct = Math.round((s.count / denom) * 1000) / 10;
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => onSelect(s.key)}
              style={{ width: `${(s.count / denom) * 100}%` }}
              className={`${s.colorClass} ${distributionBarSegmentClass}`}
              title={`${s.label} — ${pct}% (${s.count} of ${total} ${noun})`}
              aria-label={`${s.label}: ${pct}%`}
            />
          );
        })}
      </div>
      <div className={distributionBarLegendClass}>
        {segments.map((s) => (
          <Tooltip key={s.key} title={s.tooltip} placement="top">
            <TooltipTrigger
              className={distributionBarLegendItemClass}
              onClick={() => onSelect(s.key)}
            >
              <span className={`size-2 rounded-full ${s.colorClass}`} />
              <span className={distributionBarLegendLabelClass}>{s.label}</span>
              <span className={distributionBarLegendCountClass}>{s.count}</span>
            </TooltipTrigger>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
