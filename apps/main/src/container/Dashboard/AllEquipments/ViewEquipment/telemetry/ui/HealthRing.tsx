"use client";

import { cx } from "@/utils/cx";
import type { HealthTone } from "../deviceHealth";

const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TONE_COLOR: Record<HealthTone, string> = {
  healthy: "text-fg-success-primary",
  minor: "text-fg-warning-primary",
  attention: "text-fg-error-primary",
};

// One figure for the whole device, so the admin never has to sum five badges themselves.
// The score reads as a percentage on a single line: stacking a "/100" under it left two
// lines fighting over the ~50px of clear space inside the ring.
export function HealthRing({
  score,
  tone,
}: {
  score: number;
  tone: HealthTone;
}) {
  return (
    <div className="relative size-16 shrink-0">
      <svg
        viewBox="0 0 64 64"
        className="size-16 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          stroke="currentColor"
          className="text-border-secondary"
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          stroke="currentColor"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
          className={cx(
            "transition-[stroke-dashoffset] duration-500",
            TONE_COLOR[tone],
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-primary tabular-nums">
          {score}%
        </span>
      </div>
    </div>
  );
}
