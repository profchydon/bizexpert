import { HISTORY_DAYS, dayLabel } from "./historyWindow";
import { CHECK_ORDER, type CheckKey } from "./signalCopy";
import type { AgentTelemetry, TriState } from "./types";

// A day the agent could not speak for is its own state. Rendering it as anything other
// than empty is how a screen quietly lies about a device that stopped reporting.
export type DayState = "pass" | "fail" | "not_verified" | "no_data";

export interface CheckHistory {
  key: CheckKey;
  days: DayState[]; // oldest first, always HISTORY_DAYS long
  current: TriState;
  changedDaysAgo: number | null; // how long the current state has held, null if always
}

// Builds each check's last 30 days. The tail is blanked for however long the agent has
// been quiet, so a failure carries an age and silence carries a shape.
export function getComplianceHistory(
  id: string,
  t: AgentTelemetry,
  revokedDays = 0,
): CheckHistory[] {
  if (t.liveHistory?.length) {
    return t.liveHistory.map((entry) =>
      blankQuietTail(entry, revokedDays || t.daysSinceSync),
    );
  }

  return lastReportHistory(t, revokedDays);
}

function lastReportHistory(
  t: AgentTelemetry,
  revokedDays: number,
): CheckHistory[] {
  const quiet = Math.min(Math.max(t.daysSinceSync, revokedDays), HISTORY_DAYS);
  const lastReported = t.agentInstalled ? HISTORY_DAYS - quiet - 1 : -1;

  return CHECK_ORDER.map((key) => {
    const current = t.compliance[key];
    const days: DayState[] = Array.from({ length: HISTORY_DAYS }, (_, i) => {
      if (i !== lastReported) return "no_data";
      return current;
    });
    return {
      key,
      days,
      current,
      changedDaysAgo: current === "fail" && lastReported >= 0 ? 0 : null,
    };
  });
}

function blankQuietTail(entry: CheckHistory, quietDays: number): CheckHistory {
  const quiet = Math.min(Math.max(quietDays, 0), HISTORY_DAYS);
  if (quiet <= 0) return entry;
  const days = entry.days.map((state, index) =>
    index > HISTORY_DAYS - 1 - quiet ? "no_data" : state,
  );
  return { ...entry, days };
}

// Dated, not counted. "18 days" would claim we watched it fail through days the agent
// never reported; "Since Aug 3" only claims what the last sync actually saw.
export function durationLabel(entry: CheckHistory): string | null {
  if (entry.current !== "fail" || entry.changedDaysAgo === null) return null;
  return `Since ${dayLabel(entry.changedDaysAgo)}`;
}

// A run of consecutive identical days. Compliance is a step function, so thirty separate
// blocks per check implied a daily variation that mostly is not there. Runs carry the
// same information and leave room to date the moment each one changed.
export interface StateRun {
  state: DayState;
  days: number;
  startDaysAgo: number;
}

export function toRuns(entry: CheckHistory): StateRun[] {
  const runs: StateRun[] = [];
  entry.days.forEach((state, i) => {
    const last = runs[runs.length - 1];
    if (last && last.state === state) last.days += 1;
    else runs.push({ state, days: 1, startDaysAgo: HISTORY_DAYS - 1 - i });
  });
  return runs;
}

// The reading in words, so the row never depends on the picture alone.
export function readingPhrase(entry: CheckHistory): string {
  if (entry.current === "fail") {
    return entry.changedDaysAgo === null
      ? "Failing for the whole window"
      : `Off since ${dayLabel(entry.changedDaysAgo)}, ${entry.changedDaysAgo} ${entry.changedDaysAgo === 1 ? "day" : "days"}`;
  }
  if (entry.current === "not_verified") return "Never confirmed in this window";
  const lead = entry.days.findIndex((d) => d === "pass");
  if (lead > 0) return `Passing since ${dayLabel(HISTORY_DAYS - 1 - lead)}`;
  // "Every day" would overclaim on a device that stopped reporting part way through: we
  // only ever saw the days it actually sent.
  return entry.days.includes("no_data")
    ? "Passing at every report"
    : "Passing every day";
}

// Worst first, so the exception is the first thing read rather than the fourth.
const SEVERITY: Record<TriState, number> = {
  fail: 0,
  not_verified: 1,
  pass: 2,
};

export function bySeverity(a: CheckHistory, b: CheckHistory): number {
  return SEVERITY[a.current] - SEVERITY[b.current];
}

export interface DayDescription {
  date: string;
  detail: string;
}

// What a single block says when you hover it. The date alone would leave you guessing
// what the colour meant, so each one carries its own reading.
export function describeDay(
  entry: CheckHistory,
  index: number,
  daysSinceSync: number,
): DayDescription {
  const daysAgo = HISTORY_DAYS - 1 - index;
  const date = dayLabel(daysAgo);
  switch (entry.days[index]) {
    case "pass":
      return { date, detail: "Passing. The agent confirmed this check." };
    case "fail":
      return {
        date,
        detail:
          entry.changedDaysAgo === null
            ? "Failing."
            : `Failing. Started ${dayLabel(entry.changedDaysAgo)}.`,
      };
    case "not_verified":
      return {
        date,
        detail:
          "Not yet verified. The agent reported, but could not confirm a result.",
      };
    default:
      return {
        date,
        detail: `No report. The agent last synced ${dayLabel(daysSinceSync)}.`,
      };
  }
}

// Screen readers get the shape of the row without 30 separate stops to tab through.
export function summarizeHistory(entry: CheckHistory): string {
  const count = (state: DayState) =>
    entry.days.filter((d) => d === state).length;
  const parts = [
    { n: count("pass"), word: "passing" },
    { n: count("fail"), word: "failing" },
    { n: count("not_verified"), word: "not yet verified" },
    { n: count("no_data"), word: "with no report" },
  ].filter((p) => p.n > 0);
  return `Last ${HISTORY_DAYS} days: ${parts.map((p) => `${p.n} ${p.n === 1 ? "day" : "days"} ${p.word}`).join(", ")}.`;
}
