"use client";

import type { SampleWindow } from "../types";

// Shown only while it matters. A finished progress meter is noise, so once the window is
// complete this renders nothing at all rather than reporting its own success.
//
// It sits directly under the sync bar, not inside Current readings. Filed in that card it
// read as governing three tiles; it actually gates every trend on the tab,
// compliance included, so it belongs with the tab's other global caveats.
export function CollectingHistoryPanel({ history }: { history: SampleWindow }) {
  if (history.ready) return null;

  const radius = 11;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - history.days / history.need);

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-secondary bg-secondary px-3.5 py-3">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        className="shrink-0"
        role="img"
        aria-label={`${history.days} of ${history.need} days of history collected.`}
      >
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-border-secondary"
        />
        <circle
          cx="14"
          cy="14"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference.toFixed(1)}
          strokeDashoffset={offset.toFixed(1)}
          transform="rotate(-90 14 14)"
          className="stroke-fg-brand-primary"
        />
      </svg>
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="font-semibold text-primary">Collecting history</span>
          <span className="text-xs text-quaternary tabular-nums">
            {history.days} of {history.need} days
          </span>
        </p>
        <p className="mt-0.5 text-xs text-tertiary">
          Trend lines unlock on {history.unlockLabel}. The agent has recorded
          every check-in since {history.sinceLabel}.
        </p>
      </div>
    </div>
  );
}
