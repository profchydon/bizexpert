"use client";

import { cx } from "@/utils/cx";
import type { ReminderSchedule } from "../reminders";

// The cadence given a shape. The day it opened, a dot for every reminder sent, then a
// lighter run to a hollow dot for the next one. Duration, count, rhythm and what happens
// next in a single mark, which also makes the escalation difference visible: a failing
// control carries twice the dots of an unverified one over the same window.
export function ReminderTimeline({
  schedule,
  opened,
  failing,
  paused = false,
  pausedOn,
}: {
  schedule: ReminderSchedule;
  opened: string;
  failing: boolean;
  paused?: boolean;
  pausedOn?: string;
}) {
  const { sentPercents, lastSentPercent, sentCount, everyDays } = schedule;
  // A paused loop drawing its cadence in alarm colour is the proof element telling a lie:
  // its whole job is to convince the admin Rayda is already working on this.
  const fill = paused
    ? "bg-quaternary"
    : failing
      ? "bg-error-500"
      : "bg-warning-500";

  return (
    <div className="mt-3">
      <div
        className="flex h-4 items-center"
        role="img"
        aria-label={
          paused
            ? `${opened}. ${sentCount} reminders sent, then paused on ${pausedOn}. No further reminders are scheduled.`
            : `${opened}. ${sentCount} reminders sent, every ${everyDays} days. Next reminder ${schedule.nextLabel}.`
        }
      >
        {/* Inset by the dot radius plus its ring. A dot at 100% is centred on the edge, so
            without this the last one hangs half outside the card and drags the row wider. */}
        <div className="relative mx-[5px] flex h-4 flex-1 items-center">
          {/* the wait until the next reminder */}
          <span className="absolute inset-x-0 h-0.5 rounded-full bg-secondary" />
          {/* elapsed, up to the most recent send */}
          <span
            className={cx("absolute left-0 h-0.5 rounded-full", fill)}
            style={{ width: `${lastSentPercent}%` }}
          />
          {sentPercents.map((percent, i) => (
            <span
              key={i}
              className={cx(
                "absolute size-1.5 -translate-x-1/2 rounded-full ring-2 ring-primary",
                fill,
              )}
              style={{ left: `${percent}%` }}
            />
          ))}
          {/* Next reminder, not yet sent. Dropped once escalated: another turn of the loop is
            the thing that has not worked, so the track stops promising one. */}
          {!schedule.escalated && !paused && (
            <span
              className="absolute size-1.5 -translate-x-1/2 rounded-full bg-primary ring-1 ring-secondary ring-inset"
              style={{ left: "100%" }}
            />
          )}
        </div>
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-4 text-xs text-quaternary">
        <span className="tabular-nums">{opened}</span>
        <span className="tabular-nums">
          {sentCount} {sentCount === 1 ? "reminder" : "reminders"} sent
          {paused
            ? ", then paused"
            : schedule.escalated
              ? ""
              : `, every ${everyDays} days`}
        </span>
        <span
          className={cx(
            "tabular-nums",
            !paused && schedule.escalated && "font-medium text-error-primary",
          )}
        >
          {paused
            ? `paused ${pausedOn}`
            : schedule.escalated
              ? "none answered"
              : `next ${schedule.nextLabel}`}
        </span>
      </div>
    </div>
  );
}
