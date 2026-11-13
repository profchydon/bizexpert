import { LATEST_AGENT_VERSION } from "./agentTelemetry";
import type { CheckHistory } from "./complianceHistory";
import { LOW_CAPACITY_PCT, LOW_STORAGE_GB } from "./deviceHealth";
import { dayLabel } from "./historyWindow";
import { CHECK_EVENT, CHECK_READ_ERROR } from "./signalCopy";
import type { AgentTelemetry } from "./types";

export interface LogEvent {
  id: string;
  daysAgo: number;
  label: string;
  text: string;
  tone: "neutral" | "bad" | "error";
  rank: number; // selection priority, lower wins. Not a display order.
}

const MAX_EVENTS = 3;

// A compliance failure is the thing the admin came here to find, so it outranks a disk
// filling up even when the disk news is fresher. Picking purely by recency drops the
// blocker off the bottom of a three line log. Agent faults sit between the two: they
// explain the gaps in the data, but a device that is actually failing comes first.
const RANK_SYNC = 0;
const RANK_COMPLIANCE = 1;
const RANK_AGENT_ERROR = 2;
const RANK_HARDWARE = 3;

// Three lines answering the question a status badge cannot: when did this break. Built
// from the same history the track draws, so the log and the track can never disagree.
//
// `complianceOnly` is the personal device log. Compliance events stay, because compliance
// is collected there in full and the track above already dates them. Storage and battery
// events drop, because that hardware is not collected and not ours.
export function getAgentLog(
  id: string,
  t: AgentTelemetry,
  history: CheckHistory[],
  limit: number = MAX_EVENTS,
  complianceOnly = false,
): LogEvent[] {
  const events: LogEvent[] = [
    {
      id: "sync",
      daysAgo: t.daysSinceSync,
      label: dayLabel(t.daysSinceSync),
      text: t.isStale
        ? "Last successful sync. Nothing reported since."
        : "Last successful sync.",
      tone: "neutral",
      rank: RANK_SYNC,
    },
  ];

  for (const entry of history) {
    if (entry.current === "fail" && entry.changedDaysAgo !== null) {
      events.push({
        id: entry.key,
        daysAgo: entry.changedDaysAgo,
        label: dayLabel(entry.changedDaysAgo),
        text: CHECK_EVENT[entry.key],
        tone: "bad",
        rank: RANK_COMPLIANCE,
      });
    }
    // Dated at the last check-in: the agent failed to read this on every sync it made,
    // and that most recent attempt is the one worth showing.
    if (entry.current === "not_verified") {
      events.push({
        id: `${entry.key}-read`,
        daysAgo: t.daysSinceSync,
        label: dayLabel(t.daysSinceSync),
        text: CHECK_READ_ERROR[entry.key],
        tone: "error",
        rank: RANK_AGENT_ERROR,
      });
    }
  }

  if (t.agentVersion && t.agentVersion !== LATEST_AGENT_VERSION) {
    const daysAgo = t.daysSinceSync;
    events.push({
      id: "version",
      daysAgo,
      label: dayLabel(daysAgo),
      text: `Agent is running version ${t.agentVersion}. Version ${LATEST_AGENT_VERSION} is available.`,
      tone: "error",
      rank: RANK_AGENT_ERROR,
    });
  }

  if (
    !complianceOnly &&
    t.storage.totalGb > 0 &&
    t.storage.freeGb < LOW_STORAGE_GB
  ) {
    const daysAgo = t.daysSinceSync;
    events.push({
      id: "storage",
      daysAgo,
      label: dayLabel(daysAgo),
      text: `Free storage fell below ${LOW_STORAGE_GB} GB.`,
      tone: "bad",
      rank: RANK_HARDWARE,
    });
  }

  // Wear, not charge. The old version read battery.percent while calling it "health",
  // which is the confusion the rest of the tab now works to avoid: charge is a moment in
  // time, maximum capacity is the thing that degrades.
  if (
    !complianceOnly &&
    t.battery.maxCapacityPct > 0 &&
    t.battery.maxCapacityPct < LOW_CAPACITY_PCT
  ) {
    const daysAgo = t.daysSinceSync;
    events.push({
      id: "battery",
      daysAgo,
      label: dayLabel(daysAgo),
      text: `Maximum battery capacity fell below ${LOW_CAPACITY_PCT} percent of the original design.`,
      tone: "bad",
      rank: RANK_HARDWARE,
    });
  }

  // Select by priority so the blocker survives the cut, then read back in time order.
  return events
    .sort((a, b) => a.rank - b.rank || a.daysAgo - b.daysAgo)
    .slice(0, limit)
    .sort((a, b) => a.daysAgo - b.daysAgo);
}
