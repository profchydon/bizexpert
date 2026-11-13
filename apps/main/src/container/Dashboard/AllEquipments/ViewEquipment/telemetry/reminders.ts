import { HISTORY_DAYS, dayLabel, seedFor } from "./historyWindow";
import type { CheckKey } from "./signalCopy";

// Rayda nudges the person holding the device on a schedule, so the admin does not need a
// button. What they need is proof it is already happening: how long this has been open,
// how many reminders have gone out, and when the next one fires.
//
// A failing control is nudged harder than an unconfirmed one. An unverified check is an
// agent-side gap, so pushing the holder every three days would be noise they cannot act on.
const CADENCE_DAYS = { fail: 3, unverified: 7 } as const;

// Past this many unanswered sends the loop has stopped being a pending task and started
// being evidence that reminding is not working. About twelve days at the failing cadence.
export const ESCALATE_AFTER_SENDS = 4;

export interface ReminderSchedule {
  everyDays: number;
  openDays: number;
  sentCount: number;
  /** Position of each reminder along the open window, 0 to 100, oldest first. */
  sentPercents: number[];
  /** Where the most recent reminder sits, so the track can fill up to it. */
  lastSentPercent: number;
  lastSentLabel: string;
  nextLabel: string;
  /** Enough reminders have gone unanswered that promising another one is the wrong move. */
  escalated: boolean;
}

function ago(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function ahead(days: number): string {
  if (days <= 0) return "due now";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

export function getReminderSchedule(
  id: string,
  key: CheckKey,
  tone: "fail" | "unverified",
  openForDays: number | null,
): ReminderSchedule {
  const everyDays = CADENCE_DAYS[tone];
  // A check that was never confirmed has been open for the whole window.
  const openDays = Math.max(1, openForDays ?? HISTORY_DAYS);

  // Reminders fire on the cadence, counted back from the most recent one. Walking forward
  // from day zero instead would leave the last dot up to a full cadence early, which reads
  // as "every 7 days" beside a last send 9 days ago. Deriving the positions rather than
  // storing them means the count, the last send and the track can never disagree.
  const drift = seedFor(id, `reminder-${key}`) % everyDays;
  const lastSentDay = Math.min(openDays, Math.max(1, openDays - drift));
  const sentPercents: number[] = [];
  for (let day = lastSentDay; day >= 1; day -= everyDays)
    sentPercents.unshift((day / openDays) * 100);

  const lastSentPercent = sentPercents[sentPercents.length - 1];
  const lastSentDaysAgo = openDays - lastSentDay;

  return {
    everyDays,
    openDays,
    sentCount: sentPercents.length,
    sentPercents,
    lastSentPercent,
    lastSentLabel: ago(lastSentDaysAgo),
    nextLabel: ahead(everyDays - lastSentDaysAgo),
    escalated: sentPercents.length >= ESCALATE_AFTER_SENDS,
  };
}

// What the track is measuring, at its left edge.
export function openedLabel(
  tone: "fail" | "unverified",
  openForDays: number | null,
): string {
  if (tone === "unverified" || openForDays === null) return "Never confirmed";
  return `Off since ${dayLabel(openForDays)}`;
}
