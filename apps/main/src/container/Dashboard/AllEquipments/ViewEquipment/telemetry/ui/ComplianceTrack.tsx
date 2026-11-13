"use client";

import { cx } from "@/utils/cx";
import { type CheckHistory, toRuns } from "../complianceHistory";
import type { DayState } from "../complianceHistory";
import { HISTORY_DAYS, dayLabel } from "../historyWindow";

// A passing run is a thin rail rather than a filled bar, so a clean check recedes and only
// the exceptions carry weight. Failing and unverified stay full height.
const RUN: Record<DayState, string> = {
  pass: "h-1 rounded-sm bg-success-300",
  fail: "h-3 rounded-[3px] bg-error-500",
  not_verified:
    "h-3 rounded-[3px] bg-warning-200 ring-1 ring-warning-300 ring-inset",
  // Full height, like failing and unverified. As a hairline it read as empty space, so a
  // third of a stale device's history looked like nothing had happened rather than like
  // nobody had reported it.
  no_data:
    "h-3 rounded-[3px] bg-[repeating-linear-gradient(-45deg,var(--color-border-secondary)_0_4px,var(--color-bg-secondary)_4px_8px)] ring-1 ring-secondary ring-inset",
};

// Ticks at the same percentages the runs use, on a track that spans the full card. The
// previous version put the axis across the card and the bars in a narrower grid column,
// so a date and the run beneath it pointed at different days.
const TICKS = [0, 7, 14, 21, 28];

// `quietDays` is how many days at the end of the window the agent never reported. The axis
// stops there rather than at today: labelling the right edge with today's date, across a
// stretch that holds no data, claims a coverage the device never gave.
export function ComplianceAxis({ quietDays = 0 }: { quietDays?: number }) {
  const lastReported = HISTORY_DAYS - 1 - quietDays;
  const ticks = TICKS.filter((day) => day < lastReported);
  if (lastReported > 0) ticks.push(lastReported);

  return (
    <div className="relative mb-4 h-4" aria-hidden="true">
      {ticks.map((day, i) => {
        const pct = (day / (HISTORY_DAYS - 1)) * 100;
        const isLast = i === ticks.length - 1;
        const style =
          pct > 96
            ? { right: 0 }
            : {
                left: `${pct}%`,
                transform: pct < 5 ? undefined : "translateX(-50%)",
              };
        return (
          <span
            key={day}
            className={cx(
              "absolute top-0 text-xs whitespace-nowrap tabular-nums",
              isLast && quietDays > 0
                ? "font-medium text-tertiary"
                : "text-quaternary",
            )}
            style={style}
          >
            {dayLabel(HISTORY_DAYS - 1 - day)}
          </span>
        );
      })}
    </div>
  );
}

export function ComplianceTrack({ entry }: { entry: CheckHistory }) {
  const runs = toRuns(entry);
  const total = entry.days.length;
  // Every run after the first begins at a state change, and startDaysAgo dates it. The
  // marker sits at the same percentage the run does, because both measure the same track.
  //
  // A run of no_data is the agent going quiet, not the check changing. Dating it would put
  // a change marker on every row of a stale device, including ones that never moved.
  const changes = runs
    .slice(1)
    .filter((run) => run.state !== "no_data")
    .map((run) => ({
      pct: ((total - 1 - run.startDaysAgo) / total) * 100,
      label: dayLabel(run.startDaysAgo),
    }));

  return (
    <>
      <div className="flex h-3 items-center">
        {runs.map((run, i) => (
          <span
            key={i}
            className={cx(RUN[run.state])}
            style={{ flexGrow: run.days, flexBasis: 0 }}
          />
        ))}
      </div>
      {/* Always rendered, empty or not. Reserving the line keeps every row the same height:
          hanging it only on rows that changed gave a five row chart three row heights, in a
          chart whose whole job is comparison across rows. */}
      <div className="relative mt-1.5 h-3.5" aria-hidden={changes.length === 0}>
        {changes.map((change) => (
          <span
            key={change.label}
            className="absolute top-0 h-3 border-l border-secondary pl-1.5 text-xs whitespace-nowrap text-quaternary tabular-nums"
            style={{ left: `${change.pct}%` }}
          >
            {change.label}
          </span>
        ))}
      </div>
    </>
  );
}

export function ComplianceLegend() {
  return (
    <div className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2 border-t border-secondary pt-3.5 text-xs text-tertiary">
      <span className="flex items-center gap-1.5">
        <span className="h-1 w-4 rounded-sm bg-success-300" />
        Passing
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[3px] bg-error-500" />
        Failing
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[3px] bg-warning-200 ring-1 ring-warning-300 ring-inset" />
        Not yet verified
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-4 rounded-[3px] bg-[repeating-linear-gradient(-45deg,var(--color-border-secondary)_0_4px,var(--color-bg-secondary)_4px_8px)] ring-1 ring-secondary ring-inset" />
        No report
      </span>
    </div>
  );
}
