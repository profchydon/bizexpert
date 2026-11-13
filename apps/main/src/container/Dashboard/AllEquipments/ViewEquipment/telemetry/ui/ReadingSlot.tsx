"use client";

import { cx } from "@/utils/cx";
import type { Reading } from "../readings";

const TONE_TEXT: Record<Reading["tone"], string> = {
  bad: "text-error-primary",
  warn: "text-warning-primary",
  neutral: "text-brand-secondary",
};

// Only ever rendered once the sample window is complete. The caller guards it, because a
// partial series is still a trend and the reason for holding the chart back is that there
// is not yet enough history to claim one.
export function ReadingSlot({ reading }: { reading: Reading }) {
  const data = reading.series;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => [
    (i / (data.length - 1)) * 100,
    92 - ((v - min) / range) * 84,
  ]);
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`)
    .join(" ");
  const last = points[points.length - 1];

  return (
    <div className={cx("relative h-10", TONE_TEXT[reading.tone])}>
      {/* preserveAspectRatio="none" lets the path span the slot exactly. The endpoint is a
          positioned element rather than an SVG circle, which would stretch to an ellipse. */}
      <svg
        className="block h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${reading.label} over the sample window: ${reading.fromLabel} to ${reading.toLabel}, ${reading.delta}.`}
      >
        <path
          d={`${line} L100,100 L0,100 Z`}
          fill="currentColor"
          opacity={0.13}
        />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
        // The last point sits at 100%, and a centred dot there hangs half outside, giving
        // every slot a 3px horizontal overflow. Pull it back by its own radius.
        style={{
          left: `calc(${last[0].toFixed(2)}% - 3px)`,
          top: `${last[1].toFixed(2)}%`,
        }}
      />
    </div>
  );
}
