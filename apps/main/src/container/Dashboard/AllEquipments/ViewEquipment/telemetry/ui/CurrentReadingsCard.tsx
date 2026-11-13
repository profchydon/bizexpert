"use client";

import { Badge } from "@/components/base/badges/badges";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { dayCount, dayLabel } from "../historyWindow";
import type { Reading } from "../readings";
import { getReadings } from "../readings";
import type { AgentTelemetry } from "../types";
import { DetailCard } from "../DetailCard";
import { ReadingSlot } from "./ReadingSlot";

// Severity reads before any number is parsed, using the same tinted-surface device the
// verdict band uses. Only genuine warnings get colour, so the tint stays meaningful.
const TILE: Record<Reading["tone"], string> = {
  bad: "border-error-300 bg-error-25",
  warn: "border-warning-300 bg-warning-25",
  neutral: "border-secondary bg-secondary",
};
const VALUE: Record<Reading["tone"], string> = {
  bad: "text-error-primary",
  warn: "text-warning-primary",
  neutral: "text-primary",
};
const DELTA: Record<Reading["tone"], string> = {
  bad: "bg-error-50 text-error-primary",
  warn: "bg-warning-50 text-warning-primary",
  neutral: "bg-secondary text-tertiary",
};

// Static first. The reading is shown now; the trend line and the delta wait until the sample
// window is full, the way an analytics tool holds a report back for its first 48 hours.
//
// The trend is the whole deliverable. Each tile used to close with a projected sentence
// ("crosses the 70% service threshold in roughly 4 months"), which is a forecast rather than
// a reading: it extrapolates from a 60 day sample and states a month as if measured. The
// line and the delta say what actually happened, and stop there.
export function CurrentReadingsCard({
  telemetry,
  reduced = false,
  frozenOn,
}: {
  telemetry: AgentTelemetry;
  reduced?: boolean;
  frozenOn?: string;
}) {
  const readings = getReadings(telemetry, reduced);
  const { history, isStale, daysSinceSync } = telemetry;
  // A tile that says "Current" about a machine nobody has heard from in ten days is the one
  // sentence at the top of the page failing to reach the bottom of it. The title, the badge,
  // the hatched ground and the date on every tile carry the caveat down the card instead.
  // Revoked freezes the readings the same way staleness does, so it borrows the same treatment
  // rather than inventing a second one. "Current" would be wrong either way.
  const frozen = isStale || Boolean(frozenOn);
  const readAt = frozenOn ?? dayLabel(daysSinceSync);

  return (
    <DetailCard
      title={frozen ? "Last known readings" : "Current readings"}
      action={
        frozen ? (
          <Tooltip
            title={`${frozenOn ? "Collecting stopped" : "Nothing has been reported since"} ${readAt}. These values are the last ones the agent sent.`}
            placement="top"
          >
            <TooltipTrigger className="cursor-default">
              <Badge color="warning" size="sm">
                {frozenOn
                  ? `Stopped ${frozenOn}`
                  : `${dayCount(daysSinceSync)} old`}
              </Badge>
            </TooltipTrigger>
          </Tooltip>
        ) : (
          <span className="text-sm text-tertiary">At the last check-in</span>
        )
      }
    >
      <div
        className={cx(
          "grid gap-2.5",
          reduced ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3",
          frozen &&
            "rounded-xl bg-[repeating-linear-gradient(-45deg,var(--color-bg-secondary)_0_5px,transparent_5px_10px)] p-2.5 ring-1 ring-secondary ring-inset",
        )}
      >
        {readings.map((reading) => (
          <div
            key={reading.key}
            className={cx(
              "flex flex-col rounded-xl border p-3.5",
              TILE[reading.tone],
            )}
          >
            <span className="text-xs text-quaternary">
              {reading.label}
              {frozen && (
                <span className="font-medium text-warning-primary">
                  {" "}
                  · {readAt}
                </span>
              )}
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span
                className={cx(
                  "text-display-xs font-semibold tabular-nums",
                  VALUE[reading.tone],
                )}
              >
                {reading.value}
              </span>
              <span className="text-sm text-quaternary">{reading.unit}</span>
              {history.ready && (
                <span
                  className={cx(
                    "rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                    DELTA[reading.tone],
                  )}
                >
                  {reading.delta}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-tertiary">{reading.sub}</p>

            {/* Absent, not reserved. An empty frame with a sample count under it is chart
                furniture with no chart, and the footer already states the count once. */}
            {history.ready && (
              <>
                <div className="mt-3">
                  <ReadingSlot reading={reading} />
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-quaternary tabular-nums">
                  <span>{reading.fromLabel}</span>
                  <span>{reading.toLabel}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </DetailCard>
  );
}
