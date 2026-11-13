"use client";

import { cx } from "@/utils/cx";
import {
  type CheckHistory,
  bySeverity,
  readingPhrase,
} from "../complianceHistory";
import { HISTORY_DAYS } from "../historyWindow";
import { CHECK_LABEL } from "../signalCopy";
import { DetailCard } from "../DetailCard";
import {
  ComplianceAxis,
  ComplianceLegend,
  ComplianceTrack,
} from "./ComplianceTrack";
import { TriStateBadge } from "./TriStateBadge";

// Compliance with a memory. Thirty identical blocks per check implied a daily variation
// that mostly is not there, so the track draws runs and dates the moment each one changed.
//
// Three things carry the legibility: rows sort worst first, a passing run recedes to a
// thin rail, and every row states its own reading in words. The picture is confirmation
// rather than the only source.
//
// Never collapsible. This is the security posture, and a device is only as trustworthy as
// the last time someone could see it; hiding it behind a disclosure on a clean device makes
// the good news unreadable rather than cheap to read.
export function ComplianceCard({ history }: { history: CheckHistory[] }) {
  const sorted = [...history].sort(bySeverity);
  const passing = history.filter((entry) => entry.current === "pass").length;
  // Every check shares the same silent tail, so any row's days answer it. The axis needs it
  // to stop at the last report instead of labelling the right edge with today.
  const days = history[0]?.days ?? [];
  let quietDays = 0;
  for (let i = days.length - 1; i >= 0 && days[i] === "no_data"; i--)
    quietDays++;

  return (
    <DetailCard
      title="Compliance"
      action={
        <span className="text-sm text-tertiary">
          {passing} of {history.length} passing · last {HISTORY_DAYS} days
        </span>
      }
    >
      <ComplianceAxis quietDays={quietDays} />
      {sorted.map((entry, i) => {
        const phrase = readingPhrase(entry);
        return (
          <div
            key={entry.key}
            className={cx(
              "border-b border-secondary py-3.5",
              i === 0 && "pt-0",
              i === sorted.length - 1 && "border-b-0 pb-0",
            )}
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="text-sm font-semibold text-primary">
                {CHECK_LABEL[entry.key]}
              </span>
              <TriStateBadge state={entry.current} />
              <span
                className={cx(
                  "text-sm sm:ml-auto sm:text-right",
                  entry.current === "fail"
                    ? "font-medium text-error-primary"
                    : entry.current === "not_verified"
                      ? "font-medium text-warning-primary"
                      : "text-tertiary",
                )}
              >
                {phrase}
              </span>
            </div>
            <ComplianceTrack entry={entry} />
          </div>
        );
      })}
      <ComplianceLegend />
    </DetailCard>
  );
}
