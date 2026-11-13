"use client";

import { cx } from "@/utils/cx";
import type { LogEvent } from "../agentLog";
import { HISTORY_DAYS } from "../historyWindow";
import { DetailCard } from "../DetailCard";

// When it broke, most recent first. Always rendered, including on a device with nothing
// wrong: a log that hides itself when there is no bad news is one whose absence cannot be
// read, and "nothing happened" is a real answer worth stating.
export function AgentLogCard({
  events,
  defaultOpen = true,
}: {
  events: LogEvent[];
  defaultOpen?: boolean;
}) {
  const quiet = events.length <= 1;

  return (
    <DetailCard
      title="Agent activity"
      collapsible
      defaultOpen={defaultOpen}
      action={
        <span className="text-sm text-tertiary">Last {HISTORY_DAYS} days</span>
      }
    >
      <ul className="flex flex-col divide-y divide-border-secondary">
        {events.map((event) => (
          <li key={event.id} className="flex gap-4 py-2.5 first:pt-0 last:pb-0">
            <span className="w-14 shrink-0 text-sm text-tertiary tabular-nums">
              {event.label}
            </span>
            <span
              className={cx(
                "text-sm",
                event.tone === "neutral"
                  ? "text-tertiary"
                  : "font-medium text-primary",
              )}
            >
              {event.text}
            </span>
          </li>
        ))}
      </ul>
      {quiet && (
        <p className="mt-3.5 text-sm text-tertiary">
          Nothing else was recorded in this window. No compliance changed state
          and the agent reported no faults.
        </p>
      )}
    </DetailCard>
  );
}
